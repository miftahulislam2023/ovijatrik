import { notFound } from "next/navigation";
import { getWeeklyProjectBySlug } from "@/actions/weekly-project";
import { getRequestLanguage } from "@/lib/language";
import { WeeklyProjectDetail } from "@/components/site/weekly-project-detail";

export default async function WeeklyProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const language = await getRequestLanguage();
  const { slug } = await params;
  const project = await getWeeklyProjectBySlug(slug);

  if (!project || project.deletedAt) {
    notFound();
  }

  return <WeeklyProjectDetail project={project} language={language} />;
}
