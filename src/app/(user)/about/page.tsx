import Link from "next/link";
import { getRequestLanguage } from "@/lib/language";

// src/app/(public)/about/page.tsx

export default async function AboutPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "About us",
      eyebrow: "A journey toward brighter smiles",
      whoTitle: "Who we are",
      whoBody:
        "Since 2005, Ovijatrik Foundation has been working to improve the lives of underserved communities. Our core focus is creating opportunities in education, healthcare, and livelihoods. We believe that a more equitable society is possible through collective effort. Over the past two decades, we have supported thousands of families and helped create positive change.",
      viewProjects: "View our projects",
      donateNow: "Donate now",
      missionTitle: "Our mission",
      missionBody:
        "To ensure every person’s basic rights: quality education, good health, and opportunities for self-reliance. We place special emphasis on empowering women and children so they can become leaders for their families and communities.",
      visionTitle: "Our vision",
      visionBody:
        "A world free from poverty, illiteracy, and discrimination—where every child can dream and achieve. We are committed to building a sustainable and humane society where compassion guides our journey.",
      founderTitle: "Founder — Arif",
      founderQuote:
        "I deeply believe that even a little compassion can change many lives. Let’s come together in this effort and build a brighter future for the next generation. Your small donation can create a big difference.",
      legalTitle: "Legal & registration information",
      legalBody:
        "Ovijatrik Shomaj Kollyan Sangstha is a registered charitable organization under the Department of Social Services.\nRegistration No: Dinaj/2581/2024\nAddress: Islambag, Sadar, Dinajpur.",
      contactTitle: "Contact & donation information",
      contactBody1:
        "For project donations and applications, contact / bKash / Nagad / WhatsApp:",
      bKashPaymentLabel: "bKash payment:",
      walletLabel: "Nagad / bKash / Cellfin:",
      bankTitle: "Bank details",
      zakatTitle: "Dedicated account for Zakat",
      zakatNotePrefix: "After sending Zakat, please inform us on WhatsApp:",
    },
    bn: {
      title: "আমাদের সম্পর্কে",
      eyebrow: "হাসি মুখের খুঁজে অভিযাত্রা",
      whoTitle: "আমরা কারা",
      whoBody:
        "অভিযাত্রিক ফাউন্ডেশন ২০০৫ সাল থেকে সমাজের সুবিধা-বঞ্চিত মানুষের জীবনযাত্রার মান উন্নয়নে কাজ করে চলেছে। শিক্ষা, স্বাস্থ্যসেবা এবং জীবিকা অর্জনের সুযোগ সৃষ্টি করাই আমাদের মূল লক্ষ্য। আমাদের বিশ্বাস, সম্মিলিত প্রচেষ্টার মাধ্যমেই একটি উন্নত ও সমতাপূর্ণ সমাজ গঠন করা সম্ভব। গত দুই দশকে আমরা হাজার হাজার পরিবারকে সহায়তা প্রদান করেছি এবং তাদের জীবনে ইতিবাচক পরিবর্তন এনেছি।",
      viewProjects: "আমাদের প্রজেক্টসমূহ দেখুন",
      donateNow: "এখনই ডোনেট করুন",
      missionTitle: "আমাদের মিশন",
      missionBody:
        "আমাদের লক্ষ্য হলো প্রতিটি ব্যক্তির মৌলিক অধিকার নিশ্চিত করা: মানসম্মত শিক্ষা, সুস্বাস্থ্য এবং স্বনির্ভরতার সুযোগ প্রদান। আমরা বিশেষভাবে নারী ও শিশুদের ক্ষমতায়নের উপর জোর দিই যাতে তারা নিজেদের এবং তাদের সম্প্রদায়ের ভবিষ্যতের জন্য নেতা হতে পারে।",
      visionTitle: "আমাদের ভিশন",
      visionBody:
        "দারিদ্র্য, নিরক্ষরতা এবং বৈষম্যমুক্ত একটি পৃথিবী; যেখানে প্রতিটি শিশু স্বপ্ন দেখার এবং তা পূরণ করার সুযোগ পাবে। আমরা একটি টেকসই এবং মানবিক সমাজ গড়ে তুলতে প্রতিশ্রুতিবদ্ধ যেখানে করুণা আমাদের যাত্রার পথপ্রদর্শক নীতি।",
      founderTitle: "প্রতিষ্ঠাতা — আরিফ",
      founderQuote:
        "আমি গভীরভাবে বিশ্বাস করি যে, সামান্য সহানুভূতিও বহু মানুষের জীবন পাল্টে দিতে পারে। আসুন আমরা সবাই মিলে এই মহান উদ্যোগে শামিল হই এবং আগামী প্রজন্মের জন্য একটি উজ্জ্বল ভবিষ্যৎ তৈরি করি। আপনার ছোট একটি দানও এনে দিতে পারে বিশাল পরিবর্তন।",
      legalTitle: "আইনগত ও রেজিস্ট্রেশন তথ্য",
      legalBody:
        "অভিযাত্রিক সমাজকল্যাণ সংস্থা, সমাজসেবা অধিদপ্তর কর্তৃক নিবন্ধিত একটি চ্যারিটেবল অর্গানাইজেশন।\nনিবন্ধন নং: দিনাজ/২৫৮১/২০২৪\nঠিকানা: ইসলামবাগ, সদর, দিনাজপুর।",
      contactTitle: "যোগাযোগ ও অনুদান তথ্য",
      contactBody1:
        "প্রজেক্টের অনুদান এবং আবেদন পাঠাতে যোগাযোগ / বিকাশ / নগদ / হোয়াটসঅ্যাপ:",
      bKashPaymentLabel: "বিকাশ পেমেন্ট:",
      walletLabel: "নগদ / বিকাশ / সেলফিন:",
      bankTitle: "Bank Details",
      zakatTitle: "যাকাতের জন্য নির্দিষ্ট অ্যাকাউন্ট",
      zakatNotePrefix: "যাকাত পাঠিয়ে WHATSAPP এ জানিয়ে দিন এই নাম্বারে:",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm font-medium uppercase tracking-wide text-primary">
          {content.eyebrow}
        </p>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {content.whoTitle}
            </h2>
            <p className="mt-3">{content.whoBody}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {content.viewProjects}
              </Link>
              <Link
                href="/donation"
                className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {content.donateNow}
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {content.missionTitle}
            </h2>
            <p className="mt-3">{content.missionBody}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {content.visionTitle}
            </h2>
            <p className="mt-3">{content.visionBody}</p>
          </section>

          <section className="rounded-xl bg-muted p-5">
            <h2 className="text-xl font-semibold text-foreground">
              {content.founderTitle}
            </h2>
            <p className="mt-3">“{content.founderQuote}”</p>
            <p className="mt-2 font-semibold text-foreground">— Arif</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {content.legalTitle}
            </h2>
            <p className="mt-3" style={{ whiteSpace: "pre-line" }}>
              {content.legalBody}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              {content.contactTitle}
            </h2>
            <div className="mt-3 space-y-3">
              <p>
                {content.contactBody1}
                <br />
                <span className="font-semibold text-foreground">
                  01717 017 645
                </span>
                <br />
                <span className="font-semibold text-foreground">
                  01720 803 305
                </span>
              </p>

              <p>
                <span className="font-semibold text-foreground">
                  {content.bKashPaymentLabel}
                </span>
                <br />
                01886 946 826
              </p>

              <p>
                <span className="font-semibold text-foreground">
                  {content.walletLabel}
                </span>
                <br />
                01720 803 305
                <br />
                Name: Romisa Romisa (Send Money)
              </p>

              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {content.bankTitle}
                </h3>
                <p className="mt-2">
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
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {content.zakatTitle}
                </h3>
                <p className="mt-2">
                  Current A/C No: 0751 02000 8256
                  <br />
                  Name: Ovijatrik Shomaj Kollyan Sangstha
                  <br />
                  Bank: Al-Arafah Islami Bank Ltd
                  <br />
                  Branch: Dinajpur
                  <br />
                  Routing No: 015280673
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {content.zakatNotePrefix}{" "}
                  <span className="font-semibold text-foreground">
                    01717 017 645
                  </span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
