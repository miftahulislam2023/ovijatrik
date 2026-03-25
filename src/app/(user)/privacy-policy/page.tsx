// src/app/(public)/privacy-policy/page.tsx

import { getRequestLanguage } from "@/lib/language";

export default async function PrivacyPolicyPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "Privacy policy",
      subtitle:
        "This policy explains how we collect, use, and protect your personal information.",
      sections: [
        {
          title: "1. Information we collect",
          body: "When you contact us, donate, or submit an application, we may collect your name, phone number, email, address, and other necessary information.",
        },
        {
          title: "2. How we use information",
          body: "We use the collected information only for project operations, donation management, communication, and reporting. We do not sell or commercially use your information without your consent, except where required by law.",
        },
        {
          title: "3. Data security",
          body: "We take reasonable technical and organizational measures to protect your data. However, no method of transmission over the internet can be guaranteed 100% secure.",
        },
        {
          title: "4. Cookies & analytics",
          body: "We may use cookies and analytics tools to improve user experience and understand visitor behavior. You can control cookies from your browser settings.",
        },
        {
          title: "5. Changes",
          body: "We may update this policy from time to time. Updates will be posted on this page and will take effect from the time of publication.",
        },
      ],
    },
    bn: {
      title: "গোপনীয়তা নীতি",
      subtitle:
        "এই গোপনীয়তা নীতিতে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি তা ব্যাখ্যা করা হয়েছে।",
      sections: [
        {
          title: "১. তথ্য সংগ্রহ",
          body: "আপনি যখন আমাদের সাথে যোগাযোগ করেন, অনুদান প্রদান করেন বা আবেদন ফর্ম পূরণ করেন, তখন আপনার নাম, ফোন নম্বর, ইমেইল, ঠিকানা এবং প্রয়োজনীয় অন্যান্য তথ্য সংগ্রহ করা হতে পারে।",
        },
        {
          title: "২. তথ্যের ব্যবহার",
          body: "সংগৃহীত তথ্য শুধুমাত্র প্রজেক্ট পরিচালনা, অনুদান ব্যবস্থাপনা, যোগাযোগ এবং রিপোর্টিং উদ্দেশ্যে ব্যবহার করা হয়। আপনার অনুমতি ছাড়া কোনো তৃতীয় পক্ষের কাছে বিক্রি বা বাণিজ্যিকভাবে ব্যবহার করা হবে না, আইনগত প্রয়োজন ব্যতীত।",
        },
        {
          title: "৩. তথ্যের সুরক্ষা",
          body: "আপনার তথ্য সুরক্ষিত রাখতে আমরা যথাসম্ভব প্রযুক্তিগত এবং সাংগঠনিক ব্যবস্থা গ্রহণ করি। তবুও ইন্টারনেটের মাধ্যমে তথ্য আদান-প্রদানে শতভাগ নিরাপত্তা নিশ্চিত করা সম্ভব নয়।",
        },
        {
          title: "৪. কুকিজ ও অ্যানালিটিক্স",
          body: "ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে এবং ভিজিটরদের আচরণ বুঝতে আমরা কুকিজ এবং অ্যানালিটিক্স টুল ব্যবহার করতে পারি। আপনি চাইলে ব্রাউজারের সেটিংস থেকে কুকিজ নিয়ন্ত্রণ করতে পারবেন।",
        },
        {
          title: "৫. পরিবর্তন",
          body: "প্রয়োজন অনুযায়ী এই গোপনীয়তা নীতি সময়ে সময়ে পরিবর্তন করা হতে পারে। পরিবর্তিত নীতি এই পৃষ্ঠায় আপডেট করা হবে এবং তা প্রকাশের পর থেকেই কার্যকর হবে।",
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
