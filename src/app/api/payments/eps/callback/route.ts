import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEpsToken, verifyEpsPayment } from "@/lib/eps";

export const runtime = "nodejs";

function toDonationUrl(request: Request, status: string, tx?: string, reason?: string) {
  const base = new URL(request.url).origin;
  const redirectUrl = new URL("/donation", base);
  redirectUrl.searchParams.set("eps", status);
  if (tx) redirectUrl.searchParams.set("tx", tx);
  if (reason) redirectUrl.searchParams.set("reason", reason);
  return redirectUrl;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const state = (url.searchParams.get("state") || "").toLowerCase();
  const userId = url.searchParams.get("userId");
  const merchantTransactionId =
    url.searchParams.get("merchantTransactionId") ||
    url.searchParams.get("MerchantTransactionId");
  const epsTransactionId =
    url.searchParams.get("EPSTransactionId") ||
    url.searchParams.get("EpsTransactionId");

  if (state === "fail") {
    return NextResponse.redirect(toDonationUrl(request, "failed", merchantTransactionId || undefined));
  }
  if (state === "cancel") {
    return NextResponse.redirect(toDonationUrl(request, "cancelled", merchantTransactionId || undefined));
  }

  if (!merchantTransactionId && !epsTransactionId) {
    return NextResponse.redirect(toDonationUrl(request, "failed", undefined, "missing_txn"));
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
        toDonationUrl(request, "failed", verified.MerchantTransactionId, "verify_not_success")
      );
    }

    const trxid = verified.EpsTransactionId || verified.MerchantTransactionId;

    if (trxid) {
      const existing = await prisma.donation.findFirst({
        where: {
          trxid,
          medium: "OTHER",
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!existing) {
        const amount = Math.round(Number(verified.TotalAmount || "0"));
        if (amount > 0) {
          const userTag = userId ? ` UserId:${userId}` : "";
          await prisma.donation.create({
            data: {
              medium: "OTHER",
              amount,
              trxid,
              comments: `EPS payment. MerchantTxn: ${verified.MerchantTransactionId || ""}. FinancialEntity: ${verified.FinancialEntity || "N/A"}.${userTag}`,
              phone: verified.CustomerPhone || undefined,
              donorName: verified.CustomerName || undefined,
              type: "GENERAL",
              date: new Date(),
            },
          });
        }
      }
    }

    return NextResponse.redirect(
      toDonationUrl(request, "success", trxid || merchantTransactionId || undefined)
    );
  } catch {
    return NextResponse.redirect(
      toDonationUrl(request, "failed", merchantTransactionId || undefined, "verify_error")
    );
  }
}
