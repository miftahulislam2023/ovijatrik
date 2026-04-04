import Link from "next/link";
import { getWeeklyProjects } from "@/actions/weekly-project";
import { getRequestLanguage } from "@/lib/language";
import { ArrowUpRight, Target } from "lucide-react";
import { stripHtmlToText } from "@/lib/rich-text";

export default async function WeeklyProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const normalizedQuery = q.toLowerCase();

  const language = await getRequestLanguage();
  const projects = await getWeeklyProjects();

  const filteredProjects = projects.filter((project) => {
    if (!normalizedQuery) return true;

    return (
      project.titleBn.toLowerCase().includes(normalizedQuery) ||
      (project.titleEn || "").toLowerCase().includes(normalizedQuery) ||
      stripHtmlToText(project.descriptionBn).toLowerCase().includes(normalizedQuery) ||
      stripHtmlToText(project.descriptionEn || "")
        .toLowerCase()
        .includes(normalizedQuery) ||
      project.slug.toLowerCase().includes(normalizedQuery)
    );
  });

  const copy = {
    en: {
      title: "Weekly projects",
      subtitle: "Browse ongoing and recent weekly projects.",
      goal: "Goal",
      currency: "BDT",
      empty: "No weekly projects right now.",
      updates: "Weekly Impact Updates",
      project: "Project",
      noCover: "No project photo",
      readMore: "View details",
      searchTitle: "Find a project",
      searchPlaceholder: "Search by title, description, or slug...",
      searchButton: "Search",
      clearSearch: "Clear",
      showingResults: "Showing projects",
    },
    bn: {
      title: "সাপ্তাহিক প্রজেক্টসমূহ",
      subtitle: "চলমান ও সাম্প্রতিক সাপ্তাহিক প্রজেক্টগুলো এখানে দেখতে পারবেন।",
      goal: "লক্ষ্য",
      currency: "টাকা",
      empty: "এই মুহূর্তে কোনো সাপ্তাহিক প্রজেক্ট নেই।",
      updates: "সাপ্তাহিক প্রভাব আপডেট",
      project: "প্রজেক্ট",
      noCover: "প্রজেক্টের ছবি নেই",
      readMore: "বিস্তারিত দেখুন",
      searchTitle: "প্রজেক্ট খুঁজুন",
      searchPlaceholder: "শিরোনাম, বিবরণ বা স্লাগ লিখুন...",
      searchButton: "খুঁজুন",
      clearSearch: "রিসেট",
      showingResults: "দেখানো হচ্ছে",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/80 bg-linear-to-b from-cyan-50 via-background to-background dark:from-cyan-950/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.28),transparent_34%),radial-gradient(circle_at_86%_16%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_82%_86%,rgba(16,185,129,0.2),transparent_36%)] opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="inline-flex rounded-full border border-cyan-600/20 bg-cyan-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-900 dark:bg-cyan-800/30 dark:text-cyan-200">
            {content.updates}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {content.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <form
          className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]"
          method="get"
        >
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {content.searchTitle}
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder={content.searchPlaceholder}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none ring-0 transition-colors placeholder:text-muted-foreground/70 focus:border-cyan-500"
            />
          </label>

          <button
            type="submit"
            className="mt-auto h-11 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            {content.searchButton}
          </button>

          <Link
            href="/weekly-projects"
            className="mt-auto inline-flex h-11 items-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-cyan-400/60"
          >
            {content.clearSearch}
          </Link>
        </form>

        <div className="mb-6 text-sm font-medium text-muted-foreground">
          {content.showingResults}: {filteredProjects.length}
        </div>

        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => {
            const title =
              language === "en"
                ? project.titleEn || project.titleBn
                : project.titleBn;
            const description =
              language === "en"
                ? project.descriptionEn || project.descriptionBn
                : project.descriptionBn;
            const summary = stripHtmlToText(description);
            const coverPhoto = project.photos[0];

            return (
              <Link
                key={project.id}
                href={`/weekly-projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_12px_40px_-22px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <div className="relative h-56 overflow-hidden bg-muted">
                  {coverPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverPhoto}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-100 to-emerald-100 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground dark:from-cyan-900/40 dark:to-emerald-900/40">
                      {content.noCover}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                    {content.project}
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    {title}
                  </h2>

                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {summary}
                  </p>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Target className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                      {content.goal}:{" "}
                      <span className="font-semibold text-foreground">
                        {project.targetAmount} {content.currency}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                      {content.readMore}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {filteredProjects.length === 0 && (
            <p className="text-sm text-muted-foreground">{content.empty}</p>
          )}
        </div>
      </section>
    </main>
  );
}
