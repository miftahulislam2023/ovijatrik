import { notFound } from "next/navigation";
import Image from "next/image";
import { getTubewellProjectBySlug } from "@/actions/tubewell-project";
import { getRequestLanguage } from "@/lib/language";

export default async function TubewellProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const language = await getRequestLanguage();
  const { slug } = await params;
  const project = await getTubewellProjectBySlug(slug);

  if (!project || project.deletedAt) {
    notFound();
  }

  const copy = {
    en: {
      location: "Location",
      completedYear: "Completed year",
      impact: "Impact",
    },
    bn: {
      location: "অবস্থান",
      completedYear: "সম্পন্নের বছর",
      impact: "প্রভাব",
    },
  } as const;

  const content = copy[language];
  const title =
    language === "en" ? project.titleEn || project.titleBn : project.titleBn;
  const description =
    language === "en"
      ? project.descriptionEn || project.descriptionBn
      : project.descriptionBn;

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {content.location}: {project.location}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {content.completedYear}: {project.year}
        </p>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {project.photos.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.photos.map((photo, index) => (
              <Image
                key={photo + index}
                src={photo}
                alt={`${title} ${index + 1}`}
                width={1200}
                height={700}
                className="h-56 w-full rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        {project.impactSummary && (
          <div className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            <h2 className="text-base font-semibold text-foreground">
              {content.impact}
            </h2>
            <p className="mt-2">{project.impactSummary}</p>
          </div>
        )}
      </section>
    </main>
  );
}
