import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">আমাদের প্রজেক্টসমূহ</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          শিক্ষা, স্বাস্থ্য, টিউবওয়েল এবং জরুরি সহায়তা—বিভিন্ন প্রজেক্টের মাধ্যমে আমরা কাজ করে যাচ্ছি।
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            href="/weekly-projects"
            className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
          >
            <h2 className="text-base font-semibold">সাপ্তাহিক প্রজেক্ট</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              চলমান সাপ্তাহিক প্রজেক্টগুলো যেখানে আপনি সরাসরি অনুদান দিতে পারেন।
            </p>
          </Link>

          <Link
            href="/tubewell-projects"
            className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
          >
            <h2 className="text-base font-semibold">টিউবওয়েল প্রজেক্ট</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              সম্পন্ন হওয়া টিউবওয়েল প্রজেক্ট এবং এর মাধ্যমে উপকৃত মানুষের গল্প।
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
