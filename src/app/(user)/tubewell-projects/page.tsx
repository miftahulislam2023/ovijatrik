import Link from "next/link";
import { getTubewellProjects } from "@/actions/tubewell-project";
import { getRequestLanguage } from "@/lib/language";

export default async function TubewellProjectsPage() {
  const language = await getRequestLanguage();
  const projects = await getTubewellProjects();

  const copy = {
    en: {
      title: "Tubewell projects",
      subtitle: "Overview and locations of completed tubewell projects.",
      location: "Location",
      empty: "No tubewell projects have been added yet.",
    },
    bn: {
      title: "টিউবওয়েল প্রজেক্টসমূহ",
      subtitle:
        "সম্পন্ন হওয়া টিউবওয়েল প্রজেক্টগুলোর সংক্ষিপ্ত বিবরণ ও অবস্থান।",
      location: "অবস্থান",
      empty: "এখনও কোনো টিউবওয়েল প্রজেক্ট যুক্ত করা হয়নি।",
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
              href={`/tubewell-projects/${project.slug}`}
              className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
            >
              <h2 className="text-base font-semibold">
                {language === "en"
                  ? project.titleEn || project.titleBn
                  : project.titleBn}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {content.location}: {project.location}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {language === "en"
                  ? project.descriptionEn || project.descriptionBn
                  : project.descriptionBn}
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
