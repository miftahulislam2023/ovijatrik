// src/app/(public)/join-us/page.tsx

import Link from "next/link";

export default function JoinUsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">আমাদের সাথে যুক্ত হোন</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          স্বেচ্ছাসেবক, দাতা বা অংশীদার হিসেবে আপনি অভিযাত্রিক ফাউন্ডেশনের যাত্রার অংশ হতে পারেন।
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">স্বেচ্ছাসেবক</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              মাঠ পর্যায়ে কাজ, ক্যাম্পেইন, ইভেন্ট এবং সচেতনতা কার্যক্রমে অংশ নিতে পারেন।
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">ডোনার</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              নিয়মিত বা এককালীন অনুদানের মাধ্যমে আমাদের প্রজেক্টগুলোকে এগিয়ে নিতে পারেন।
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">পার্টনার</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              কর্পোরেট বা সংগঠন হিসেবে সামাজিক দায়বদ্ধতার অংশ হিসেবে আমাদের সাথে কাজ করতে পারেন।
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/donation"
            className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            এখনই ডোনেট করুন
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            আমাদের সাথে যোগাযোগ করুন
          </Link>
        </div>
      </section>
    </main>
  );
}
