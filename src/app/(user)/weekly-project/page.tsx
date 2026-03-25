import Link from "next/link";
import { getWeeklyProjects } from "@/actions/weekly-project";
import { getRequestLanguage } from "@/lib/language";

export default async function WeeklyProjectsPage() {
  const language = await getRequestLanguage();
  const projects = await getWeeklyProjects();

  const copy = {
    en: {
      title: "Weekly projects",
      subtitle: "Browse ongoing and recent weekly projects.",
      goal: "Goal",
      currency: "BDT",
      empty: "No weekly projects right now.",
    },
    bn: {
      title: "সাপ্তাহিক প্রজেক্টসমূহ",
      subtitle: "চলমান ও সাম্প্রতিক সাপ্তাহিক প্রজেক্টগুলো এখানে দেখতে পারবেন।",
      goal: "লক্ষ্য",
      currency: "টাকা",
      empty: "এই মুহূর্তে কোনো সাপ্তাহিক প্রজেক্ট নেই।",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/weekly-projects/${project.slug}`}
              className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
            >
              <h2 className="text-base font-semibold">
                {language === "en"
                  ? project.titleEn || project.titleBn
                  : project.titleBn}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {language === "en"
                  ? project.descriptionEn || project.descriptionBn
                  : project.descriptionBn}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {content.goal}:{" "}
                <span className="font-semibold text-foreground">
                  {project.targetAmount} {content.currency}
                </span>
              </p>
            </Link>
          ))}

          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground">{content.empty}</p>
          )}
        </div>
      </section>
    </main>
  );
}
