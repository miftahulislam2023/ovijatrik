import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function NotFound() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      overline: "Path Interrupted",
      titleStart: "Even the best-laid plans encounter",
      titleAccent: "obstacles.",
      description:
        "The story you were looking for has moved or is currently being rewritten. Let's find our way back to impact that matters.",
      returnHome: "Return Home",
      exploreProjects: "Explore Projects",
      suggest: "Might we suggest",
      suggestionOne: "Viewing our latest impact report",
      suggestionTwo: "Contacting our support advocate",
    },
    bn: {
      overline: "পথে বাধা",
      titleStart: "সেরা পরিকল্পনাও কখনও কখনও",
      titleAccent: "বাধার মুখে পড়ে।",
      description:
        "আপনি যে পৃষ্ঠাটি খুঁজছিলেন তা সরানো হয়েছে বা নতুনভাবে তৈরি হচ্ছে। আসুন, প্রভাবশালী কাজের পথে ফিরে যাই।",
      returnHome: "হোমে ফিরে যান",
      exploreProjects: "প্রকল্পগুলো দেখুন",
      suggest: "আপনি চাইলে",
      suggestionOne: "আমাদের সর্বশেষ প্রভাব প্রতিবেদন দেখতে পারেন",
      suggestionTwo: "সাপোর্ট টিমের সাথে যোগাযোগ করতে পারেন",
    },
  } as const;

  const content = copy[language];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
          <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-md bg-accent/30" />
          <div className="relative aspect-4/3 rounded-xl border border-border bg-linear-to-br from-primary/40 via-primary/20 to-background" />
        </div>

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            {content.overline}
          </p>
          <h1 className="mt-2 max-w-md text-5xl font-bold leading-[0.97] text-foreground sm:text-7xl">
            {content.titleStart}{" "}
            <span className="italic text-primary">{content.titleAccent}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            {content.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              {content.returnHome}
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              {content.exploreProjects}
            </Link>
          </div>

          <div className="mt-7 rounded-xl bg-muted p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {content.suggest}
            </p>
            <ul className="mt-2 space-y-2 text-sm text-foreground">
              <li className="inline-flex items-center gap-1">
                <ArrowRight className="h-3.5 w-3.5" />
                {content.suggestionOne}
              </li>
              <li className="inline-flex items-center gap-1">
                <ArrowRight className="h-3.5 w-3.5" />
                {content.suggestionTwo}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
