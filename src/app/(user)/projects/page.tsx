import Link from "next/link";
import { getRequestLanguage } from "@/lib/language";

export default async function ProjectsPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "Our projects",
      subtitle:
        "We work across education, health, tubewells, and emergency support through different initiatives.",
      weeklyTitle: "Weekly projects",
      weeklyBody: "Ongoing weekly projects where you can donate directly.",
      tubewellTitle: "Tubewell projects",
      tubewellBody: "Completed tubewell projects and stories of impact.",
    },
    bn: {
      title: "আমাদের প্রজেক্টসমূহ",
      subtitle:
        "শিক্ষা, স্বাস্থ্য, টিউবওয়েল এবং জরুরি সহায়তা—বিভিন্ন প্রজেক্টের মাধ্যমে আমরা কাজ করে যাচ্ছি।",
      weeklyTitle: "সাপ্তাহিক প্রজেক্ট",
      weeklyBody:
        "চলমান সাপ্তাহিক প্রজেক্টগুলো যেখানে আপনি সরাসরি অনুদান দিতে পারেন।",
      tubewellTitle: "টিউবওয়েল প্রজেক্ট",
      tubewellBody:
        "সম্পন্ন হওয়া টিউবওয়েল প্রজেক্ট এবং এর মাধ্যমে উপকৃত মানুষের গল্প।",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            href="/weekly-projects"
            className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
          >
            <h2 className="text-base font-semibold">{content.weeklyTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.weeklyBody}
            </p>
          </Link>

          <Link
            href="/tubewell-projects"
            className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
          >
            <h2 className="text-base font-semibold">{content.tubewellTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.tubewellBody}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
