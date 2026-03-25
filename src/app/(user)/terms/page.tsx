// src/app/(public)/terms/page.tsx

import { getRequestLanguage } from "@/lib/language";

export default async function TermsPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "Terms",
      subtitle:
        "These terms explain how the Ovijatrik Foundation platform can be used.",
      sections: [
        {
          title: "1. Platform use",
          body: "This website is used for social welfare activities, information sharing, and collecting donations. You may not use this platform for any illegal, harmful, or misleading activity.",
        },
        {
          title: "2. Donations",
          body: "Your donations are used transparently across our projects. Donations are generally non-refundable once made, but exceptions may be considered at the organization’s discretion in special circumstances.",
        },
        {
          title: "3. Accuracy of information",
          body: "We strive to present project, activity, and financial information as accurately as possible. We reserve the right to correct errors or omissions.",
        },
        {
          title: "4. Changes",
          body: "We may update these terms from time to time. Updated terms will be posted on this page and will take effect from the time of publication.",
        },
      ],
    },
    bn: {
      title: "শর্তাবলী",
      subtitle:
        "এই পৃষ্ঠাটি অভিযাত্রিক ফাউন্ডেশন প্ল্যাটফর্ম ব্যবহারের শর্তাবলী ব্যাখ্যা করে।",
      sections: [
        {
          title: "১. প্ল্যাটফর্ম ব্যবহার",
          body: "এই ওয়েবসাইটটি শুধুমাত্র সামাজিক কল্যাণমূলক কার্যক্রম, তথ্য প্রদর্শন এবং অনুদান সংগ্রহের উদ্দেশ্যে ব্যবহৃত হয়। কোনো ধরনের অবৈধ, ক্ষতিকর বা বিভ্রান্তিকর কার্যক্রমের জন্য এই প্ল্যাটফর্ম ব্যবহার করা যাবে না।",
        },
        {
          title: "২. অনুদান",
          body: "আপনার প্রদত্ত অনুদান আমাদের বিভিন্ন প্রজেক্টে স্বচ্ছতার সাথে ব্যবহার করা হয়। অনুদান একবার প্রদান করার পর সাধারণত তা ফেরতযোগ্য নয়, তবে বিশেষ পরিস্থিতিতে সংগঠনের সিদ্ধান্ত অনুযায়ী ব্যবস্থা নেওয়া হতে পারে।",
        },
        {
          title: "৩. তথ্যের সঠিকতা",
          body: "আমরা আমাদের প্রজেক্ট, কার্যক্রম এবং আর্থিক তথ্য যথাসম্ভব সঠিকভাবে উপস্থাপন করার চেষ্টা করি। তবুও কোনো ভুল বা ত্রুটি থাকলে তা সংশোধনের অধিকার আমাদের রয়েছে।",
        },
        {
          title: "৪. পরিবর্তন",
          body: "প্রয়োজন অনুযায়ী এই শর্তাবলী সময়ে সময়ে পরিবর্তন করা হতে পারে। পরিবর্তিত শর্তাবলী এই পৃষ্ঠায় আপডেট করা হবে এবং তা প্রকাশের পর থেকেই কার্যকর হবে।",
        },
      ],
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

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-2">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
