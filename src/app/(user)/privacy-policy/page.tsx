// src/app/(public)/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">গোপনীয়তা নীতি</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          এই গোপনীয়তা নীতিতে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি তা ব্যাখ্যা করা হয়েছে।
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">১. তথ্য সংগ্রহ</h2>
            <p className="mt-2">
              আপনি যখন আমাদের সাথে যোগাযোগ করেন, অনুদান প্রদান করেন বা আবেদন ফর্ম পূরণ করেন, তখন আপনার নাম, ফোন নম্বর,
              ইমেইল, ঠিকানা এবং প্রয়োজনীয় অন্যান্য তথ্য সংগ্রহ করা হতে পারে।
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">২. তথ্যের ব্যবহার</h2>
            <p className="mt-2">
              সংগৃহীত তথ্য শুধুমাত্র প্রজেক্ট পরিচালনা, অনুদান ব্যবস্থাপনা, যোগাযোগ এবং রিপোর্টিং উদ্দেশ্যে ব্যবহার
              করা হয়। আপনার অনুমতি ছাড়া কোনো তৃতীয় পক্ষের কাছে বিক্রি বা বাণিজ্যিকভাবে ব্যবহার করা হবে না, আইনগত
              প্রয়োজন ব্যতীত।
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">৩. তথ্যের সুরক্ষা</h2>
            <p className="mt-2">
              আপনার তথ্য সুরক্ষিত রাখতে আমরা যথাসম্ভব প্রযুক্তিগত এবং সাংগঠনিক ব্যবস্থা গ্রহণ করি। তবুও ইন্টারনেটের
              মাধ্যমে তথ্য আদান-প্রদানে শতভাগ নিরাপত্তা নিশ্চিত করা সম্ভব নয়।
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">৪. কুকিজ ও অ্যানালিটিক্স</h2>
            <p className="mt-2">
              ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে এবং ভিজিটরদের আচরণ বুঝতে আমরা কুকিজ এবং অ্যানালিটিক্স টুল ব্যবহার করতে
              পারি। আপনি চাইলে ব্রাউজারের সেটিংস থেকে কুকিজ নিয়ন্ত্রণ করতে পারবেন।
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">৫. পরিবর্তন</h2>
            <p className="mt-2">
              প্রয়োজন অনুযায়ী এই গোপনীয়তা নীতি সময়ে সময়ে পরিবর্তন করা হতে পারে। পরিবর্তিত নীতি এই পৃষ্ঠায়
              আপডেট করা হবে এবং তা প্রকাশের পর থেকেই কার্যকর হবে।
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
