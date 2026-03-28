import { NextResponse } from "next/server";
import {
  getEpsToken,
  getMerchantTransactionId,
  initializeEpsPayment,
} from "@/lib/eps";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type InitiateBody = {
  amount?: number;
  donorName?: string;
  email?: string;
  phone?: string;
  isAnonymousPublic?: boolean;
  campaignType?: "WEEKLY" | "TUBEWELL";
  campaignSlug?: string;
};

function resolveIpAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "127.0.0.1";
  }
  return "127.0.0.1";
}

function trimValue(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = (await request.json()) as InitiateBody;

    const amount = Number(body.amount || 0);
    const donorNameInput = trimValue(body.donorName);
    const emailInput = trimValue(body.email);
    const phoneInput = trimValue(body.phone);
    const isAnonymousPublic = Boolean(body.isAnonymousPublic);
    const address = "Dinajpur";
    const city = "Dinajpur";
    const campaignType =
      body.campaignType === "WEEKLY" || body.campaignType === "TUBEWELL"
        ? body.campaignType
        : undefined;
    const campaignSlug = trimValue(body.campaignSlug);

    let profileName = "";
    let profileEmail = "";
    let profileUserId = "";

    if (session?.user?.id) {
      const profile = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true },
      });
      profileName = trimValue(profile?.name);
      profileEmail = trimValue(profile?.email);
      profileUserId = trimValue(profile?.id);
    }

    const fallbackName = "Ovijatrik Donor";
    const fallbackEmail = "support@ovijatrik.org";
    const fallbackPhone = "01720803305";

    const donorName = profileName || donorNameInput || fallbackName;
    const email = profileEmail || emailInput || fallbackEmail;
    const phone = phoneInput || fallbackPhone;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
    }

    const merchantTransactionId = getMerchantTransactionId();
    const customerOrderId = `DON-${merchantTransactionId}`;

    const origin = new URL(request.url).origin;
    const callbackBase = process.env.NEXT_PUBLIC_APP_URL?.trim() || origin;

    const successUrl = new URL("/api/payments/eps/callback", callbackBase);
    successUrl.searchParams.set("state", "success");
    successUrl.searchParams.set("merchantTransactionId", merchantTransactionId);
    if (profileUserId) {
      successUrl.searchParams.set("userId", profileUserId);
    }
    if (campaignType && campaignSlug) {
      successUrl.searchParams.set("campaignType", campaignType);
      successUrl.searchParams.set("campaignSlug", campaignSlug);
    }
    if (isAnonymousPublic) {
      successUrl.searchParams.set("anonymous", "1");
    }

    const failUrl = new URL("/api/payments/eps/callback", callbackBase);
    failUrl.searchParams.set("state", "fail");
    failUrl.searchParams.set("merchantTransactionId", merchantTransactionId);
    if (profileUserId) {
      failUrl.searchParams.set("userId", profileUserId);
    }
    if (campaignType && campaignSlug) {
      failUrl.searchParams.set("campaignType", campaignType);
      failUrl.searchParams.set("campaignSlug", campaignSlug);
    }
    if (isAnonymousPublic) {
      failUrl.searchParams.set("anonymous", "1");
    }

    const cancelUrl = new URL("/api/payments/eps/callback", callbackBase);
    cancelUrl.searchParams.set("state", "cancel");
    cancelUrl.searchParams.set("merchantTransactionId", merchantTransactionId);
    if (profileUserId) {
      cancelUrl.searchParams.set("userId", profileUserId);
    }
    if (campaignType && campaignSlug) {
      cancelUrl.searchParams.set("campaignType", campaignType);
      cancelUrl.searchParams.set("campaignSlug", campaignSlug);
    }
    if (isAnonymousPublic) {
      cancelUrl.searchParams.set("anonymous", "1");
    }

    const token = await getEpsToken();

    const initialized = await initializeEpsPayment({
      token,
      merchantTransactionId,
      customerOrderId,
      totalAmount: amount,
      successUrl: successUrl.toString(),
      failUrl: failUrl.toString(),
      cancelUrl: cancelUrl.toString(),
      customerName: donorName,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      customerCity: city,
      customerCountry: "BD",
      ipAddress: resolveIpAddress(request),
    });

    return NextResponse.json({
      redirectUrl: initialized.redirectUrl,
      merchantTransactionId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
