// src/app/(public)/page.tsx  → Home

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            হাসি মুখের খুঁজে অভিযাত্রা
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            সুবিধাবঞ্চিত মানুষের জন্য একটি মানবিক যাত্রা — <span className="text-primary">অভিযাত্রিক ফাউন্ডেশন</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            ২০০৫ সাল থেকে অভিযাত্রিক ফাউন্ডেশন শিক্ষা, স্বাস্থ্যসেবা এবং জীবিকা অর্জনের সুযোগ সৃষ্টির মাধ্যমে
            সুবিধাবঞ্চিত মানুষের জীবনমান উন্নয়নে কাজ করে যাচ্ছে। আপনার ছোট একটি দানও এনে দিতে পারে বিশাল পরিবর্তন।
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/donation"
              className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              এখনই ডোনেট করুন
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              আমাদের প্রজেক্টসমূহ দেখুন
            </Link>
          </div>
        </div>

        <div className="mt-10 flex-1 md:mt-0">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">আমাদের মিশন</h2>
            <p className="text-sm text-muted-foreground">
              প্রতিটি মানুষের মৌলিক অধিকার — মানসম্মত শিক্ষা, সুস্বাস্থ্য এবং স্বনির্ভরতার সুযোগ নিশ্চিত করা।
              বিশেষভাবে নারী ও শিশুদের ক্ষমতায়নের মাধ্যমে একটি টেকসই ও মানবিক সমাজ গড়ে তোলা।
            </p>
            <div className="mt-6 rounded-xl bg-background/60 p-4 text-sm text-muted-foreground">
              “সামান্য সহানুভূতিও বহু মানুষের জীবন পাল্টে দিতে পারে। আসুন আমরা সবাই মিলে এই মহান উদ্যোগে শামিল হই।”
              <br />
              <span className="mt-2 inline-block font-semibold text-foreground">— আরিফ, প্রতিষ্ঠাতা</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-3">
          <div className="rounded-xl bg-background p-5 shadow-sm">
            <h3 className="text-base font-semibold">শিক্ষা</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              সুবিধাবঞ্চিত শিশুদের জন্য মানসম্মত শিক্ষা ও সহায়তা, যাতে তারা স্বপ্ন দেখতে এবং তা পূরণ করতে পারে।
            </p>
          </div>
          <div className="rounded-xl bg-background p-5 shadow-sm">
            <h3 className="text-base font-semibold">স্বাস্থ্য</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              প্রাথমিক স্বাস্থ্যসেবা, সচেতনতা এবং জরুরি সহায়তার মাধ্যমে সুস্থ সমাজ গড়ে তোলার প্রচেষ্টা।
            </p>
          </div>
          <div className="rounded-xl bg-background p-5 shadow-sm">
            <h3 className="text-base font-semibold">জীবিকা</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              দক্ষতা উন্নয়ন ও জীবিকা অর্জনের সুযোগ সৃষ্টি করে পরিবারকে স্বনির্ভর করে তোলার উদ্যোগ।
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
