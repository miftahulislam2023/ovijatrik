import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEpsToken, verifyEpsPayment } from "@/lib/eps";

export const runtime = "nodejs";

function toDonationUrl(
  request: Request,
  status: string,
  tx?: string,
  reason?: string,
  campaignType?: string,
  campaignSlug?: string,
) {
  const base = new URL(request.url).origin;
  const redirectUrl = new URL("/donation", base);
  redirectUrl.searchParams.set("eps", status);
  if (tx) redirectUrl.searchParams.set("tx", tx);
  if (reason) redirectUrl.searchParams.set("reason", reason);
  if (campaignType) redirectUrl.searchParams.set("campaign", campaignType);
  if (campaignSlug) redirectUrl.searchParams.set("project", campaignSlug);
  return redirectUrl;
}

function toDonationReceiptUrl(request: Request, donationId: string) {
  const base = new URL(request.url).origin;
  return new URL(`/donation/${donationId}`, base);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const state = (url.searchParams.get("state") || "").toLowerCase();
  const userId = url.searchParams.get("userId");
  const isAnonymousPublic = url.searchParams.get("anonymous") === "1";
  const campaignTypeRaw = (url.searchParams.get("campaignType") || "").toUpperCase();
  const campaignSlug = (url.searchParams.get("campaignSlug") || "").trim();
  const campaignType =
    campaignTypeRaw === "WEEKLY" || campaignTypeRaw === "TUBEWELL"
      ? campaignTypeRaw
      : null;
  const merchantTransactionId =
    url.searchParams.get("merchantTransactionId") ||
    url.searchParams.get("MerchantTransactionId");
  const epsTransactionId =
    url.searchParams.get("EPSTransactionId") ||
    url.searchParams.get("EpsTransactionId");

  if (state === "fail") {
    return NextResponse.redirect(
      toDonationUrl(
        request,
        "failed",
        merchantTransactionId || undefined,
        undefined,
        campaignType || undefined,
        campaignSlug || undefined,
      ),
    );
  }
  if (state === "cancel") {
    return NextResponse.redirect(
      toDonationUrl(
        request,
        "cancelled",
        merchantTransactionId || undefined,
        undefined,
        campaignType || undefined,
        campaignSlug || undefined,
      ),
    );
  }

  if (!merchantTransactionId && !epsTransactionId) {
    return NextResponse.redirect(
      toDonationUrl(
        request,
        "failed",
        undefined,
        "missing_txn",
        campaignType || undefined,
        campaignSlug || undefined,
      ),
    );
  }

  try {
    const token = await getEpsToken();
    const verified = await verifyEpsPayment({
      token,
      merchantTransactionId,
      epsTransactionId,
    });

    if ((verified.Status || "").toLowerCase() !== "success") {
      return NextResponse.redirect(
        toDonationUrl(
          request,
          "failed",
          verified.MerchantTransactionId,
          "verify_not_success",
          campaignType || undefined,
          campaignSlug || undefined,
        ),
      );
    }

    const trxid = verified.EpsTransactionId || verified.MerchantTransactionId;
    let receiptDonationId: string | null = null;

    if (trxid) {
      const existing = await prisma.donation.findFirst({
        where: {
          trxid,
          deletedAt: null,
        },
        select: { id: true },
      });

      const existingWeekly = await prisma.weeklyDonation.findFirst({
        where: {
          trxid,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (existing?.id) {
        receiptDonationId = existing.id;
      } else if (existingWeekly?.id) {
        receiptDonationId = existingWeekly.id;
      }

      if (!existing && !existingWeekly) {
        const amount = Math.round(Number(verified.TotalAmount || "0"));
        if (amount > 0) {
          const userTag = userId ? ` UserId:${userId}` : "";
          if (campaignType === "WEEKLY" && campaignSlug) {
            const project = await prisma.weeklyProject.findFirst({
              where: {
                slug: campaignSlug,
                deletedAt: null,
              },
              select: { id: true },
            });

            if (project) {
              const createdWeekly = await prisma.weeklyDonation.create({
                data: {
                  projectId: project.id,
                  medium: "EPS",
                  amount,
                  trxid,
                  comments: `EPS payment. MerchantTxn: ${verified.MerchantTransactionId || ""}. FinancialEntity: ${verified.FinancialEntity || "N/A"}.${userTag}`,
                  phone: verified.CustomerPhone || undefined,
                  donorName: isAnonymousPublic
                    ? undefined
                    : verified.CustomerName || undefined,
                  date: new Date(),
                },
              });
              receiptDonationId = createdWeekly.id;

              const aggregate = await prisma.weeklyDonation.aggregate({
                where: { projectId: project.id, deletedAt: null },
                _sum: { amount: true },
              });

              await prisma.weeklyProject.update({
                where: { id: project.id },
                data: { currentAmount: aggregate._sum.amount ?? 0 },
              });
            } else {
              const createdDonation = await prisma.donation.create({
                data: {
                  medium: "EPS",
                  amount,
                  trxid,
                  comments: `EPS payment (weekly project not found: ${campaignSlug}). MerchantTxn: ${verified.MerchantTransactionId || ""}. FinancialEntity: ${verified.FinancialEntity || "N/A"}.${userTag}`,
                  phone: verified.CustomerPhone || undefined,
                  donorName: isAnonymousPublic
                    ? undefined
                    : verified.CustomerName || undefined,
                  type: "GENERAL",
                  date: new Date(),
                },
              });
              receiptDonationId = createdDonation.id;
            }
          } else {
            const campaignTag =
              campaignType && campaignSlug
                ? ` Campaign:${campaignType}:${campaignSlug}.`
                : "";

            const createdDonation = await prisma.donation.create({
              data: {
                medium: "EPS",
                amount,
                trxid,
                comments: `EPS payment.${campaignTag} MerchantTxn: ${verified.MerchantTransactionId || ""}. FinancialEntity: ${verified.FinancialEntity || "N/A"}.${userTag}`,
                phone: verified.CustomerPhone || undefined,
                donorName: isAnonymousPublic
                  ? undefined
                  : verified.CustomerName || undefined,
                type: "GENERAL",
                date: new Date(),
              },
            });
            receiptDonationId = createdDonation.id;
          }
        }
      }
    }

    if (receiptDonationId) {
      return NextResponse.redirect(toDonationReceiptUrl(request, receiptDonationId));
    }

    return NextResponse.redirect(
      toDonationUrl(
        request,
        "success",
        trxid || merchantTransactionId || undefined,
        undefined,
        campaignType || undefined,
        campaignSlug || undefined,
      ),
    );
  } catch {
    return NextResponse.redirect(
      toDonationUrl(
        request,
        "failed",
        merchantTransactionId || undefined,
        "verify_error",
        campaignType || undefined,
        campaignSlug || undefined,
      ),
    );
  }
}
