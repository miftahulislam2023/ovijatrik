import { notFound } from "next/navigation";
import { getTubewellProjectBySlug } from "@/actions/tubewell-project";

export default async function TubewellProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getTubewellProjectBySlug(slug);

  if (!project || project.deletedAt) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{project.titleBn}</h1>
        <p className="mt-2 text-sm text-muted-foreground">অবস্থান: {project.location}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          সম্পন্নের বছর: {project.year}
        </p>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          {project.descriptionBn}
        </p>

        {project.impactSummary && (
          <div className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            <h2 className="text-base font-semibold text-foreground">প্রভাব</h2>
            <p className="mt-2">{project.impactSummary}</p>
          </div>
        )}
      </section>
    </main>
  );
}
