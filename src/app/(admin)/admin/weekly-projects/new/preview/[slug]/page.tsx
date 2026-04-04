import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { WeeklyProjectDetail } from "@/components/site/weekly-project-detail";

export default async function WeeklyProjectPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const language = await getRequestLanguage();
  const { slug } = await params;

  const project = await prisma.weeklyProject.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
    include: {
      donations: {
        where: { deletedAt: null },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {language === "bn" ? "প্রিভিউ পাওয়া যায়নি" : "Preview not available"}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {language === "bn"
            ? "এই স্লাগে এখনো কোনো সেভ করা প্রজেক্ট নেই। আগে প্রজেক্ট সেভ করুন, তারপর প্রিভিউ দেখুন।"
            : "No saved project exists for this slug yet. Save the project first, then preview it."}
        </p>
        <Link
          href="/admin/weekly-projects/new"
          className="inline-flex rounded-lg bg-[#045e6f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#034c5a]"
        >
          {language === "bn" ? "ফর্মে ফিরে যান" : "Back to form"}
        </Link>
      </main>
    );
  }

  return <WeeklyProjectDetail project={project} language={language} />;
}
