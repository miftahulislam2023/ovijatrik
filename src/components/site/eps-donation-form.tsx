"use client";

import { FormEvent, useMemo, useState } from "react";

type Language = "en" | "bn";

type Copy = {
  title: string;
  subtitle: string;
  loggedInBadge: string;
  amount: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  payNow: string;
  processing: string;
  secureNote: string;
  requiredHint: string;
  amountQuick: string;
  trustTitle: string;
  trustLine1: string;
  trustLine2: string;
};

const text: Record<Language, Copy> = {
  en: {
    title: "Online Payment (EPS Gateway)",
    subtitle: "Pay securely by card/mobile banking through EasyPaymentSystem.",
    loggedInBadge: "Signed in: details are prefilled",
    amount: "Donation Amount (BDT)",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    payNow: "Continue to Secure Payment",
    processing: "Redirecting to payment gateway...",
    secureNote:
      "You will be redirected to EPS checkout and then returned here.",
    requiredHint: "All fields marked with * are required.",
    amountQuick: "Quick amounts",
    trustTitle: "Secure flow",
    trustLine1: "Hash-signed request with EPS API",
    trustLine2: "Final verification before donation is stored",
  },
  bn: {
    title: "অনলাইন পেমেন্ট (EPS গেটওয়ে)",
    subtitle:
      "EasyPaymentSystem এর মাধ্যমে নিরাপদে কার্ড/মোবাইল ব্যাংকিং পেমেন্ট করুন।",
    loggedInBadge: "আপনি লগইন অবস্থায় আছেন: তথ্য স্বয়ংক্রিয়ভাবে পূরণ করা হয়েছে",
    amount: "অনুদানের পরিমাণ (টাকা)",
    name: "পূর্ণ নাম",
    email: "ইমেইল",
    phone: "ফোন",
    address: "ঠিকানা",
    city: "শহর",
    payNow: "নিরাপদ পেমেন্টে এগিয়ে যান",
    processing: "পেমেন্ট গেটওয়েতে নেওয়া হচ্ছে...",
    secureNote:
      "আপনাকে EPS পেজে নেওয়া হবে এবং পেমেন্টের পর এখানে ফেরত আনা হবে।",
    requiredHint: "* চিহ্নিত সকল ঘর পূরণ করা আবশ্যক।",
    amountQuick: "দ্রুত পরিমাণ",
    trustTitle: "নিরাপদ প্রসেস",
    trustLine1: "EPS API-তে hash-signed অনুরোধ",
    trustLine2: "ডোনেশন সংরক্ষণের আগে চূড়ান্ত ভেরিফিকেশন",
  },
};

type EpsDonationFormProps = {
  language: Language;
  initialName?: string;
  initialEmail?: string;
  isLoggedIn?: boolean;
};

export function EpsDonationForm({
  language,
  initialName,
  initialEmail,
  isLoggedIn,
}: EpsDonationFormProps) {
  const copy = useMemo(() => text[language], [language]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountValue, setAmountValue] = useState<string>("");

  function setQuickAmount(amount: number) {
    setAmountValue(String(amount));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      amount: Number(formData.get("amount") || 0),
      donorName: String(formData.get("donorName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      city: String(formData.get("city") || "").trim(),
    };

    try {
      const response = await fetch("/api/payments/eps/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.redirectUrl) {
        setError(result.error || "Unable to initialize payment.");
        setLoading(false);
        return;
      }

      window.location.href = result.redirectUrl as string;
    } catch {
      setError("Network error while initializing payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/25 bg-[linear-gradient(135deg,rgba(13,148,136,0.12),rgba(56,189,248,0.08),rgba(251,191,36,0.12))] p-6 shadow-[0_20px_60px_-24px_rgba(8,47,73,0.55)] backdrop-blur-sm md:p-8">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-300/25 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative mb-5">
        <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-slate-900 dark:text-cyan-100">
          {copy.title}
        </h2>
        <p className="mt-1.5 text-sm text-slate-700 dark:text-cyan-50/80">
          {copy.subtitle}
        </p>
        {isLoggedIn ? (
          <p className="mt-3 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-900 dark:text-cyan-100">
            {copy.loggedInBadge}
          </p>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="relative space-y-4">
        <div>
          <label
            className="mb-1 block text-sm font-semibold text-slate-800 dark:text-cyan-50"
            htmlFor="eps-amount"
          >
            {copy.amount} *
          </label>
          <input
            id="eps-amount"
            name="amount"
            type="number"
            min="1"
            required
            value={amountValue}
            onChange={(event) => setAmountValue(event.target.value)}
            className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50 dark:placeholder:text-cyan-50/35"
            placeholder="100"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600 dark:text-cyan-50/70">
              {copy.amountQuick}:
            </span>
            {[300, 500, 1000, 2500].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setQuickAmount(quickAmount)}
                className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-cyan-100/20 dark:bg-slate-900/50 dark:text-cyan-50/90 dark:hover:border-cyan-300"
              >
                {quickAmount}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="mb-1 block text-sm font-semibold text-slate-800 dark:text-cyan-50"
              htmlFor="eps-name"
            >
              {copy.name} *
            </label>
            <input
              id="eps-name"
              name="donorName"
              type="text"
              required
              defaultValue={initialName || ""}
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-semibold text-slate-800 dark:text-cyan-50"
              htmlFor="eps-phone"
            >
              {copy.phone} *
            </label>
            <input
              id="eps-phone"
              name="phone"
              type="tel"
              required
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="mb-1 block text-sm font-semibold text-slate-800 dark:text-cyan-50"
              htmlFor="eps-email"
            >
              {copy.email} *
            </label>
            <input
              id="eps-email"
              name="email"
              type="email"
              required
              defaultValue={initialEmail || ""}
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-semibold text-slate-800 dark:text-cyan-50"
              htmlFor="eps-city"
            >
              {copy.city}
            </label>
            <input
              id="eps-city"
              name="city"
              type="text"
              defaultValue="Dhaka"
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
            />
          </div>
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-semibold text-slate-800 dark:text-cyan-50"
            htmlFor="eps-address"
          >
            {copy.address}
          </label>
          <input
            id="eps-address"
            name="address"
            type="text"
            defaultValue="Dhaka"
            className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
          />
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,#0d9488,#0891b2,#2563eb)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? copy.processing : copy.payNow}
          </button>
          <p className="text-xs text-slate-600 dark:text-cyan-50/70">
            {copy.requiredHint}
          </p>
          <p className="text-xs text-slate-600 dark:text-cyan-50/70">
            {copy.secureNote}
          </p>

          <div className="rounded-xl border border-white/60 bg-white/70 p-3 dark:border-cyan-100/20 dark:bg-slate-950/40">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 dark:text-cyan-50/80">
              {copy.trustTitle}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-cyan-50/70">
              {copy.trustLine1}
            </p>
            <p className="text-xs text-slate-600 dark:text-cyan-50/70">
              {copy.trustLine2}
            </p>
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-400/30 dark:bg-rose-900/20 dark:text-rose-300">
              {error}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
