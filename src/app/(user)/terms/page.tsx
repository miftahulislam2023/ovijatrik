// src/app/(public)/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">শর্তাবলী</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          এই পৃষ্ঠাটি অভিযাত্রিক ফাউন্ডেশন প্ল্যাটফর্ম ব্যবহারের শর্তাবলী ব্যাখ্যা করে।
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">১. প্ল্যাটফর্ম ব্যবহার</h2>
            <p className="mt-2">
              এই ওয়েবসাইটটি শুধুমাত্র সামাজিক কল্যাণমূলক কার্যক্রম, তথ্য প্রদর্শন এবং অনুদান সংগ্রহের উদ্দেশ্যে
              ব্যবহৃত হয়। কোনো ধরনের অবৈধ, ক্ষতিকর বা বিভ্রান্তিকর কার্যক্রমের জন্য এই প্ল্যাটফর্ম ব্যবহার করা যাবে না।
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">২. অনুদান</h2>
            <p className="mt-2">
              আপনার প্রদত্ত অনুদান আমাদের বিভিন্ন প্রজেক্টে স্বচ্ছতার সাথে ব্যবহার করা হয়। অনুদান একবার প্রদান করার
              পর সাধারণত তা ফেরতযোগ্য নয়, তবে বিশেষ পরিস্থিতিতে সংগঠনের সিদ্ধান্ত অনুযায়ী ব্যবস্থা নেওয়া হতে পারে।
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">৩. তথ্যের সঠিকতা</h2>
            <p className="mt-2">
              আমরা আমাদের প্রজেক্ট, কার্যক্রম এবং আর্থিক তথ্য যথাসম্ভব সঠিকভাবে উপস্থাপন করার চেষ্টা করি। তবুও কোনো
              ভুল বা ত্রুটি থাকলে তা সংশোধনের অধিকার আমাদের রয়েছে।
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground">৪. পরিবর্তন</h2>
            <p className="mt-2">
              প্রয়োজন অনুযায়ী এই শর্তাবলী সময়ে সময়ে পরিবর্তন করা হতে পারে। পরিবর্তিত শর্তাবলী এই পৃষ্ঠায়
              আপডেট করা হবে এবং তা প্রকাশের পর থেকেই কার্যকর হবে।
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
