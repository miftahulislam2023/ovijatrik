import Link from "next/link";
import { getRequestLanguage } from "@/lib/language";
import { EpsDonationForm } from "@/components/site/eps-donation-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Heart,
  Smartphone,
  Building2,
  ShieldCheck,
  ArrowRight,
  Phone,
  Wallet,
} from "lucide-react";

export default async function DonationPage({
  searchParams,
}: {
  searchParams: Promise<{
    eps?: string;
    tx?: string;
    campaign?: string;
    project?: string;
  }>;
}) {
  const language = await getRequestLanguage();
  const { eps, tx, campaign, project } = await searchParams;
  const session = await auth();

  const campaignRaw = String(campaign || "").toUpperCase();
  const campaignSlug = String(project || "").trim();
  const campaignType =
    campaignRaw === "WEEKLY" || campaignRaw === "TUBEWELL"
      ? campaignRaw
      : undefined;

  const [weeklyProjects, tubewellProjects] = await Promise.all([
    prisma.weeklyProject.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: { slug: true, titleBn: true, titleEn: true },
    }),
    prisma.tubewellProject.findMany({
      where: { deletedAt: null },
      orderBy: { completionDate: "desc" },
      select: { slug: true, titleBn: true, titleEn: true },
    }),
  ]);

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      })
    : null;

  const copy = {
    en: {
      title: "Make a Difference Today",
      subtitle:
        "Your generous donation helps us move forward with critical education, health, and livelihood projects for those in need.",
      walletsTitle: "Mobile Banking",
      walletsIntro:
        "For project donations and applications, contact via bKash, Nagad, or WhatsApp:",
      bkashPayment: "bKash Payment (Merchant):",
      walletLabel: "Nagad / bKash / Cellfin (Personal):",
      bankTitle: "Bank Transfer",
      zakatTitle: "Dedicated Zakat Fund",
      zakatNote: "After sending Zakat, please inform us on WhatsApp:",
      footer:
        "Every donation is recorded with 100% transparency and strictly utilized according to the designated project.",
      applyHelp: "Need support? Apply for donation help",
      sponsor: "Want to sponsor a family or tubewell?",
      sponsorCta: "Explore sponsorship",
      epsFailed:
        "Online payment failed or could not be verified. Please try again.",
      epsCancelled: "Payment was cancelled. You can retry anytime.",
      txLabel: "Transaction",
      projectDonationFor: "You are donating for",
      weeklyProjectLabel: "Weekly Project",
      tubewellProjectLabel: "Tubewell Project",
    },
    bn: {
      title: "আজই অনুদান করুন",
      subtitle:
        "আপনার মূল্যবান অনুদান আমাদের শিক্ষা, স্বাস্থ্য ও জীবিকা ভিত্তিক প্রজেক্টগুলোকে এগিয়ে নিতে সাহায্য করে।",
      walletsTitle: "মোবাইল ব্যাংকিং",
      walletsIntro:
        "প্রজেক্টের অনুদান এবং আবেদন পাঠাতে যোগাযোগ / বিকাশ / নগদ / হোয়াটসঅ্যাপ:",
      bkashPayment: "বিকাশ পেমেন্ট (মার্চেন্ট):",
      walletLabel: "নগদ / বিকাশ / সেলফিন (পার্সোনাল):",
      bankTitle: "ব্যাংক ট্রান্সফার",
      zakatTitle: "যাকাতের জন্য নির্দিষ্ট ফান্ড",
      zakatNote: "যাকাত পাঠিয়ে অনুগ্রহ করে WhatsApp-এ জানিয়ে দিন:",
      footer:
        "আপনার প্রতিটি অনুদান ১০০% স্বচ্ছতার সাথে রেকর্ড করা হয় এবং প্রজেক্ট ভিত্তিকভাবে ব্যবহার করা হয়।",
      applyHelp: "সহায়তা প্রয়োজন? অনুদানের জন্য আবেদন করুন",
      sponsor: "একটি পরিবার বা টিউবওয়েল স্পন্সর করতে চান?",
      sponsorCta: "স্পন্সরশিপ দেখুন",
      epsFailed:
        "অনলাইন পেমেন্ট ব্যর্থ হয়েছে বা যাচাই করা যায়নি। আবার চেষ্টা করুন।",
      epsCancelled: "পেমেন্ট বাতিল করা হয়েছে। চাইলে আবার চেষ্টা করতে পারেন।",
      txLabel: "ট্রানজ্যাকশন",
      projectDonationFor: "আপনি অনুদান দিচ্ছেন",
      weeklyProjectLabel: "সাপ্তাহিক প্রকল্প",
      tubewellProjectLabel: "টিউবওয়েল প্রকল্প",
    },
  } as const;

  const content = copy[language];

  const paymentStatusMessage =
    eps === "failed"
      ? content.epsFailed
      : eps === "cancelled"
        ? content.epsCancelled
        : null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_90%_20%,rgba(244,114,182,0.16),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_45%,#f6fff6_100%)] selection:bg-cyan-300/35 dark:bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.18),transparent_30%),linear-gradient(180deg,#07111f_0%,#09172b_45%,#0b1620_100%)]">
      {/* Compact Hero Section */}
      <section className="relative overflow-hidden border-b border-cyan-200/40 py-12 text-center md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,74,110,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(12,74,110,0.08)_1px,transparent_1px)] bg-size-[30px_30px] dark:bg-[linear-gradient(to_right,rgba(103,232,249,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(103,232,249,0.08)_1px,transparent_1px)]"></div>
        <div className="pointer-events-none absolute -left-16 top-6 h-52 w-52 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-12 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/70 shadow-lg ring-1 ring-cyan-500/20 dark:bg-slate-900/70 dark:ring-cyan-300/30">
            <Heart
              className="h-7 w-7 text-cyan-700 dark:text-cyan-200"
              fill="currentColor"
            />
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-extrabold tracking-tight text-slate-900 dark:text-cyan-100 sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-cyan-50/80 sm:text-lg">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Standard Spaced Grid */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        {paymentStatusMessage ? (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${
              eps === "success"
                ? "border-emerald-300 bg-emerald-50/95 text-emerald-800"
                : eps === "cancelled"
                  ? "border-amber-300 bg-amber-50/95 text-amber-800"
                  : "border-rose-300 bg-rose-50/95 text-rose-800"
            }`}
          >
            {paymentStatusMessage}
            {tx ? (
              <span className="ml-2 font-mono text-xs">
                ({content.txLabel}: {tx})
              </span>
            ) : null}
          </div>
        ) : null}

        {campaignType && campaignSlug ? (
          <div className="mb-6 rounded-2xl border border-cyan-300/60 bg-cyan-50/90 px-4 py-3 text-sm font-semibold text-cyan-900 dark:border-cyan-300/30 dark:bg-cyan-900/20 dark:text-cyan-100">
            {content.projectDonationFor}:{" "}
            {campaignType === "WEEKLY"
              ? content.weeklyProjectLabel
              : content.tubewellProjectLabel}{" "}
            <span className="font-mono text-xs">{campaignSlug}</span>
          </div>
        ) : null}

        <div className="mb-6">
          <EpsDonationForm
            language={language}
            initialName={user?.name || ""}
            initialEmail={user?.email || ""}
            isLoggedIn={Boolean(session?.user?.id)}
            campaignType={
              campaignType as "GENERAL" | "WEEKLY" | "TUBEWELL" | undefined
            }
            campaignSlug={campaignSlug || undefined}
            weeklyProjects={weeklyProjects.map((project) => ({
              slug: project.slug,
              title:
                language === "en"
                  ? project.titleEn || project.titleBn
                  : project.titleBn,
            }))}
            tubewellProjects={tubewellProjects.map((project) => ({
              slug: project.slug,
              title:
                language === "en"
                  ? project.titleEn || project.titleBn
                  : project.titleBn,
            }))}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Mobile Wallets Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-sky-200/50 bg-white/85 p-6 shadow-[0_12px_40px_-24px_rgba(2,132,199,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-24px_rgba(2,132,199,0.65)] dark:border-cyan-100/10 dark:bg-slate-900/45">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700 dark:text-cyan-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900 dark:text-cyan-50">
                {content.walletsTitle}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-sky-100/50 p-4 dark:bg-cyan-950/25">
                <p className="mb-2 flex items-start gap-2 text-sm text-slate-700 dark:text-cyan-50/75">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-300" />
                  {content.walletsIntro}
                </p>
                <div className="flex flex-col gap-1 font-mono text-base font-semibold tracking-wide text-slate-900 dark:text-cyan-50">
                  <a
                    href="https://wa.me/8801717017645"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    01717 017 645
                  </a>
                  <a
                    href="https://wa.me/8801720803305"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    01720 803 305
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-200/70 bg-white/65 p-4 dark:border-cyan-100/10 dark:bg-slate-900/35">
                <p className="mb-1 text-sm font-medium text-slate-600 dark:text-cyan-50/70">
                  {content.bkashPayment}
                </p>
                <p className="font-mono text-lg font-bold text-slate-900 dark:text-cyan-50">
                  01886 946 826
                </p>
              </div>

              <div className="rounded-2xl border border-sky-200/70 bg-white/65 p-4 dark:border-cyan-100/10 dark:bg-slate-900/35">
                <p className="mb-1 text-sm font-medium text-slate-600 dark:text-cyan-50/70">
                  {content.walletLabel}
                </p>
                <p className="font-mono text-lg font-bold text-slate-900 dark:text-cyan-50">
                  01720 803 305
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-cyan-50/70">
                  <Wallet className="h-4 w-4" /> Name: Romisa Romisa
                </p>
                <a
                  href="https://wa.me/8801720803305"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-sm font-semibold text-cyan-700 underline-offset-4 hover:underline dark:text-cyan-300"
                >
                  WhatsApp: 01720 803 305
                </a>
              </div>
            </div>
          </div>

          {/* Bank Transfer Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-emerald-200/50 bg-white/85 p-6 shadow-[0_12px_40px_-24px_rgba(5,150,105,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-24px_rgba(5,150,105,0.65)] dark:border-emerald-100/10 dark:bg-slate-900/45">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900 dark:text-emerald-50">
                {content.bankTitle}
              </h2>
            </div>

            <div className="rounded-2xl border border-emerald-200/70 bg-white/70 p-4 shadow-sm dark:border-emerald-100/10 dark:bg-slate-900/35">
              <div className="space-y-2.5 text-sm text-slate-600 dark:text-emerald-50/75">
                <div className="flex justify-between border-b border-emerald-200/60 pb-2 dark:border-emerald-100/10">
                  <span>A/C No:</span>
                  <strong className="font-mono text-base text-slate-900 dark:text-emerald-50">
                    2050 1380 1005 57502
                  </strong>
                </div>
                <div className="flex justify-between border-b border-emerald-200/60 pb-2 dark:border-emerald-100/10">
                  <span>Name:</span>
                  <strong className="text-right text-slate-900 dark:text-emerald-50">
                    Ovijatrik Shomaj Kollyan Sangstha
                  </strong>
                </div>
                <div className="flex justify-between border-b border-emerald-200/60 pb-2 dark:border-emerald-100/10">
                  <span>Bank:</span>
                  <strong className="text-right text-slate-900 dark:text-emerald-50">
                    Islami Bank Bangladesh PLC
                  </strong>
                </div>
                <div className="flex justify-between border-b border-emerald-200/60 pb-2 dark:border-emerald-100/10">
                  <span>Branch:</span>
                  <strong className="text-right text-slate-900 dark:text-emerald-50">
                    Dinajpur
                  </strong>
                </div>
                <div className="flex justify-between border-b border-emerald-200/60 pb-2 dark:border-emerald-100/10">
                  <span>Routing No:</span>
                  <strong className="font-mono text-slate-900 dark:text-emerald-50">
                    125280671
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Swift Code:</span>
                  <strong className="font-mono text-slate-900 dark:text-emerald-50">
                    IBBLBDDH138
                  </strong>
                </div>
              </div>
            </div>

            {/* Zakat Highlight Box */}
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
              <div className="mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Heart className="h-4 w-4" fill="currentColor" />
                <h3 className="font-bold">{content.zakatTitle}</h3>
              </div>
              <div className="space-y-1.5 text-sm text-emerald-900/80 dark:text-emerald-100/70">
                <p>
                  Current A/C No:{" "}
                  <strong className="font-mono text-emerald-900 dark:text-emerald-100">
                    0751 02000 8256
                  </strong>
                </p>
                <p>
                  Bank:{" "}
                  <strong className="text-emerald-900 dark:text-emerald-100">
                    Al-Arafah Islami Bank Ltd, Dinajpur
                  </strong>
                </p>
                <p>
                  Routing No:{" "}
                  <strong className="font-mono text-emerald-900 dark:text-emerald-100">
                    015280673
                  </strong>
                </p>
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-100/50 p-2.5 dark:bg-emerald-900/30">
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs sm:text-sm">
                    {content.zakatNote}{" "}
                    <a
                      href="https://wa.me/8801717017645"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                    >
                      01717 017 645
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer & CTA */}
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-cyan-200/50 bg-white/75 p-6 text-center shadow-lg backdrop-blur-sm dark:border-cyan-100/10 dark:bg-slate-900/45 sm:p-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 shadow-sm dark:bg-cyan-950/45">
            <ShieldCheck className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
          </div>
          <p className="max-w-2xl text-balance text-sm text-slate-700 dark:text-cyan-50/80">
            {content.footer}
          </p>
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/apply-for-donation"
                className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#0891b2,#2563eb)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-110"
              >
                {content.applyHelp}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sponsor"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-50/60 px-5 py-2.5 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-100 dark:border-cyan-200/30 dark:bg-cyan-950/35 dark:text-cyan-100 dark:hover:bg-cyan-900/35"
              >
                {content.sponsorCta}
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-cyan-50/70">
              {content.sponsor}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
