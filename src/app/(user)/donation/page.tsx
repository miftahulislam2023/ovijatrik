// src/app/(public)/donation/page.tsx

import { getRequestLanguage } from "@/lib/language";

export default async function DonationPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "Donate",
      subtitle:
        "Your donation helps us move forward with education, health, and livelihood projects.",
      walletsTitle: "bKash / Nagad / Cellfin",
      walletsIntro:
        "For project donations and applications, contact / bKash / Nagad / WhatsApp:",
      bkashPayment: "bKash payment:",
      walletLabel: "Nagad / bKash / Cellfin:",
      bankTitle: "Bank transfer",
      zakatTitle: "Dedicated account for Zakat:",
      zakatNote: "After sending Zakat, please inform us on WhatsApp:",
      footer:
        "Every donation is recorded transparently and used according to the project.",
    },
    bn: {
      title: "অনুদান করুন",
      subtitle:
        "আপনার অনুদান আমাদের শিক্ষা, স্বাস্থ্য ও জীবিকা ভিত্তিক প্রজেক্টগুলোকে এগিয়ে নিতে সাহায্য করে।",
      walletsTitle: "বিকাশ / নগদ / সেলফিন",
      walletsIntro:
        "প্রজেক্টের অনুদান এবং আবেদন পাঠাতে যোগাযোগ / বিকাশ / নগদ / হোয়াটসঅ্যাপ:",
      bkashPayment: "বিকাশ পেমেন্ট:",
      walletLabel: "নগদ / বিকাশ / সেলফিন:",
      bankTitle: "ব্যাংক ট্রান্সফার",
      zakatTitle: "যাকাতের জন্য নির্দিষ্ট অ্যাকাউন্ট:",
      zakatNote: "যাকাত পাঠিয়ে WHATSAPP এ জানিয়ে দিন:",
      footer:
        "আপনার প্রতিটি অনুদান স্বচ্ছতার সাথে রেকর্ড করা হয় এবং প্রজেক্ট ভিত্তিকভাবে ব্যবহার করা হয়।",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">{content.walletsTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.walletsIntro}
              <br />
              <span className="font-semibold text-foreground">
                01717 017 645
              </span>
              <br />
              <span className="font-semibold text-foreground">
                01720 803 305
              </span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {content.bkashPayment}
              </span>
              <br />
              01886 946 826
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {content.walletLabel}
              </span>
              <br />
              01720 803 305
              <br />
              Name: Romisa Romisa (Send Money)
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">{content.bankTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A/C No: 2050 1380 1005 57502
              <br />
              Name: Ovijatrik Shomaj Kollyan Sangstha
              <br />
              Bank: Islami Bank Bangladesh PLC
              <br />
              Branch: Dinajpur
              <br />
              Routing No: 125280671
              <br />
              Swift code: IBBLBDDH138
            </p>

            <div className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {content.zakatTitle}
              </span>
              <br />
              Current A/C No: 0751 02000 8256
              <br />
              Bank: Al-Arafah Islami Bank Ltd, Dinajpur
              <br />
              Routing No: 015280673
              <br />
              {content.zakatNote}{" "}
              <span className="font-semibold text-foreground">
                01717 017 645
              </span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">{content.footer}</p>
      </section>
    </main>
  );
}
