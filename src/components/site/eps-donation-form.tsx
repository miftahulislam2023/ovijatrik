"use client";

import { FormEvent, useMemo, useState } from "react";

type Language = "en" | "bn";

type Copy = {
  title: string;
  subtitle: string;
  loggedInBadge: string;
  donationFor: string;
  donationForGeneral: string;
  donationForWeekly: string;
  donationForTubewell: string;
  projectLabel: string;
  projectPlaceholder: string;
  amount: string;
  name: string;
  email: string;
  phone: string;
  hidePublicName: string;
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
    donationFor: "Donate for",
    donationForGeneral: "General Fund",
    donationForWeekly: "Weekly Project",
    donationForTubewell: "Tubewell Project",
    projectLabel: "Select Project",
    projectPlaceholder: "Choose a project (optional)",
    amount: "Donation Amount (BDT)",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    hidePublicName: "Do not show my name publicly",
    payNow: "Continue to Secure Payment",
    processing: "Redirecting to payment gateway...",
    secureNote:
      "You will be redirected to EPS checkout and then returned here.",
    requiredHint: "Only amount is required. Other fields are optional.",
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
    donationFor: "কোথায় অনুদান করবেন",
    donationForGeneral: "সাধারণ তহবিল",
    donationForWeekly: "সাপ্তাহিক প্রকল্প",
    donationForTubewell: "টিউবওয়েল প্রকল্প",
    projectLabel: "প্রকল্প নির্বাচন",
    projectPlaceholder: "প্রকল্প বাছাই করুন (ঐচ্ছিক)",
    amount: "অনুদানের পরিমাণ (টাকা)",
    name: "পূর্ণ নাম",
    email: "ইমেইল",
    phone: "ফোন",
    hidePublicName: "আমার নাম পাবলিকভাবে দেখাবেন না",
    payNow: "নিরাপদ পেমেন্টে এগিয়ে যান",
    processing: "পেমেন্ট গেটওয়েতে নেওয়া হচ্ছে...",
    secureNote:
      "আপনাকে EPS পেজে নেওয়া হবে এবং পেমেন্টের পর এখানে ফেরত আনা হবে।",
    requiredHint: "শুধু পরিমাণ আবশ্যক। বাকি তথ্য ঐচ্ছিক।",
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
  campaignType?: "GENERAL" | "WEEKLY" | "TUBEWELL";
  campaignSlug?: string;
  weeklyProjects?: Array<{ slug: string; title: string }>;
  tubewellProjects?: Array<{ slug: string; title: string }>;
};

export function EpsDonationForm({
  language,
  initialName,
  initialEmail,
  isLoggedIn,
  campaignType,
  campaignSlug,
  weeklyProjects = [],
  tubewellProjects = [],
}: EpsDonationFormProps) {
  const copy = useMemo(() => text[language], [language]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountValue, setAmountValue] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<
    "GENERAL" | "WEEKLY" | "TUBEWELL"
  >(campaignType || "GENERAL");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>(
    campaignSlug || "",
  );
  const [hidePublicName, setHidePublicName] = useState(false);

  const selectedProjects =
    selectedCampaign === "WEEKLY"
      ? weeklyProjects
      : selectedCampaign === "TUBEWELL"
        ? tubewellProjects
        : [];

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
      campaignType:
        selectedCampaign === "GENERAL" ? undefined : selectedCampaign,
      campaignSlug:
        selectedCampaign === "GENERAL"
          ? undefined
          : selectedProjectSlug || undefined,
      isAnonymousPublic: hidePublicName,
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

      <form onSubmit={onSubmit} className="relative space-y-3">
        <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
          <label
            className="text-sm font-semibold text-slate-800 dark:text-cyan-50"
            htmlFor="eps-campaign"
          >
            {copy.donationFor}
          </label>
          <select
            id="eps-campaign"
            value={selectedCampaign}
            onChange={(event) => {
              const nextCampaign = event.target.value as
                | "GENERAL"
                | "WEEKLY"
                | "TUBEWELL";
              setSelectedCampaign(nextCampaign);
              setSelectedProjectSlug("");
            }}
            className="h-10 w-full rounded-xl border border-white/60 bg-white/80 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
          >
            <option value="GENERAL">{copy.donationForGeneral}</option>
            <option value="WEEKLY">{copy.donationForWeekly}</option>
            <option value="TUBEWELL">{copy.donationForTubewell}</option>
          </select>
        </div>

        {selectedCampaign !== "GENERAL" ? (
          <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
            <label
              className="text-sm font-semibold text-slate-800 dark:text-cyan-50"
              htmlFor="eps-project"
            >
              {copy.projectLabel}
            </label>
            <select
              id="eps-project"
              value={selectedProjectSlug}
              onChange={(event) => setSelectedProjectSlug(event.target.value)}
              className="h-10 w-full rounded-xl border border-white/60 bg-white/80 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
            >
              <option value="">{copy.projectPlaceholder}</option>
              {selectedProjects.map((project) => (
                <option key={project.slug} value={project.slug}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
          <label
            className="text-sm font-semibold text-slate-800 dark:text-cyan-50"
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
            className="h-10 w-full rounded-xl border border-white/60 bg-white/80 px-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50 dark:placeholder:text-cyan-50/35"
            placeholder="100"
          />
        </div>

        <div className="sm:pl-40">
          <div className="mt-1 flex flex-wrap items-center gap-2">
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

        <div className="rounded-xl border border-white/60 bg-white/70 p-3 dark:border-cyan-100/20 dark:bg-slate-950/40">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-cyan-50/85">
            <input
              type="checkbox"
              checked={hidePublicName}
              onChange={(event) => setHidePublicName(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-cyan-600"
            />
            {copy.hidePublicName}
          </label>
        </div>

        {!hidePublicName ? (
          <>
            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
              <label
                className="text-sm font-semibold text-slate-800 dark:text-cyan-50"
                htmlFor="eps-name"
              >
                {copy.name}
              </label>
              <input
                id="eps-name"
                name="donorName"
                type="text"
                defaultValue={initialName || ""}
                className="h-10 w-full rounded-xl border border-white/60 bg-white/80 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
              <label
                className="text-sm font-semibold text-slate-800 dark:text-cyan-50"
                htmlFor="eps-phone"
              >
                {copy.phone}
              </label>
              <input
                id="eps-phone"
                name="phone"
                type="tel"
                className="h-10 w-full rounded-xl border border-white/60 bg-white/80 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
              <label
                className="text-sm font-semibold text-slate-800 dark:text-cyan-50"
                htmlFor="eps-email"
              >
                {copy.email}
              </label>
              <input
                id="eps-email"
                name="email"
                type="email"
                defaultValue={initialEmail || ""}
                className="h-10 w-full rounded-xl border border-white/60 bg-white/80 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 dark:border-cyan-200/20 dark:bg-slate-950/50 dark:text-cyan-50"
              />
            </div>
          </>
        ) : null}

        <div className="space-y-2 pt-1">
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
