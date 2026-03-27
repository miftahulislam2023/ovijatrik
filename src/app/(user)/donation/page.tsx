import Link from "next/link";
import { getRequestLanguage } from "@/lib/language";
import {
  Heart,
  Smartphone,
  Building2,
  ShieldCheck,
  ArrowRight,
  Phone,
  Wallet,
} from "lucide-react";

export default async function DonationPage() {
  const language = await getRequestLanguage();
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
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      {/* Compact Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-primary/10 via-background to-background py-10 text-center md:py-14">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Standard Spaced Grid */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Mobile Wallets Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md dark:bg-card/40">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">{content.walletsTitle}</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="mb-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {content.walletsIntro}
                </p>
                <div className="flex flex-col gap-1 font-mono text-base font-semibold tracking-wide text-foreground">
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

              <div className="rounded-xl border border-border/50 p-4">
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {content.bkashPayment}
                </p>
                <p className="font-mono text-lg font-bold text-foreground">
                  01886 946 826
                </p>
              </div>

              <div className="rounded-xl border border-border/50 p-4">
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {content.walletLabel}
                </p>
                <p className="font-mono text-lg font-bold text-foreground">
                  01720 803 305
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" /> Name: Romisa Romisa
                </p>
                <a
                  href="https://wa.me/8801720803305"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  WhatsApp: 01720 803 305
                </a>
              </div>
            </div>
          </div>

          {/* Bank Transfer Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md dark:bg-card/40">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">{content.bankTitle}</h2>
            </div>

            <div className="rounded-xl border border-border/50 p-4 shadow-sm">
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>A/C No:</span>
                  <strong className="font-mono text-base text-foreground">
                    2050 1380 1005 57502
                  </strong>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Name:</span>
                  <strong className="text-right text-foreground">
                    Ovijatrik Shomaj Kollyan Sangstha
                  </strong>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Bank:</span>
                  <strong className="text-right text-foreground">
                    Islami Bank Bangladesh PLC
                  </strong>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Branch:</span>
                  <strong className="text-right text-foreground">
                    Dinajpur
                  </strong>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Routing No:</span>
                  <strong className="font-mono text-foreground">
                    125280671
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Swift Code:</span>
                  <strong className="font-mono text-foreground">
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
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl bg-muted/50 p-6 text-center sm:p-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <p className="max-w-2xl text-balance text-sm text-muted-foreground">
            {content.footer}
          </p>
          <div className="mt-5">
            <Link
              href="/apply-for-donation"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
            >
              {content.applyHelp}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
