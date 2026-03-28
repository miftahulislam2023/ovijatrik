import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRequestLanguage } from "@/lib/language";
import {
  bulkDeleteWeeklyProjectsPermanently,
  bulkSoftDeleteWeeklyProjects,
  deleteWeeklyProjectPermanently,
  duplicateWeeklyProject,
  softDeleteWeeklyProject,
} from "@/actions/weekly-project";
import { ProjectStatus } from "@/generated/prisma/enums";
import { Pencil, Plus, Search } from "lucide-react";

const statusClass: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "secondary",
};

export default async function WeeklyProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";

  const copy = isBn
    ? {
        badge: "অ্যাডমিন",
        title: "সাপ্তাহিক প্রকল্প",
        subtitle:
          "পুনরাবৃত্ত কমিউনিটি উদ্যোগ পরিচালনা করুন এবং অনুদানের অবস্থা স্বচ্ছ রাখুন।",
        addNewProject: "নতুন প্রকল্প যোগ করুন",
        totalActiveFunding: "মোট সক্রিয় তহবিল",
        acrossProjects: "এই পাতার সব প্রকল্প মিলিয়ে",
        liveProjects: "চলমান প্রকল্প",
        currentlyPublished: "বর্তমানে প্রকাশিত",
        archived: "আর্কাইভ",
        preservedRecords: "সংরক্ষিত রেকর্ড",
        searchPlaceholder: "শিরোনাম বা স্লাগ দিয়ে খুঁজুন",
        allStatuses: "সব স্ট্যাটাস",
        statusDraft: "খসড়া",
        statusPublished: "প্রকাশিত",
        statusArchived: "আর্কাইভ",
        applyFilters: "ফিল্টার প্রয়োগ করুন",
        project: "প্রকল্প",
        category: "ক্যাটাগরি",
        funding: "তহবিল",
        status: "স্ট্যাটাস",
        actions: "অ্যাকশন",
        weeklyImpact: "সাপ্তাহিক ইমপ্যাক্ট",
        goal: "লক্ষ্য",
        edit: "এডিট",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        delete: "ডিলিট",
        selectedActions: "নির্বাচিত প্রকল্পের অ্যাকশন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        deleteSelected: "নির্বাচিত ডিলিট",
        select: "নির্বাচন",
        noProjects: "এখনও কোনো সাপ্তাহিক প্রকল্প নেই।",
        pageLabel: "পৃষ্ঠা",
        ofLabel: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        badge: "Admin",
        title: "Weekly Projects",
        subtitle:
          "Manage recurring community initiatives and keep donation status transparent.",
        addNewProject: "Add New Project",
        totalActiveFunding: "Total Active Funding",
        acrossProjects: "Across projects on this page",
        liveProjects: "Live Projects",
        currentlyPublished: "Currently published",
        archived: "Archived",
        preservedRecords: "Preserved records",
        searchPlaceholder: "Search by title or slug",
        allStatuses: "All statuses",
        statusDraft: "Draft",
        statusPublished: "Published",
        statusArchived: "Archived",
        applyFilters: "Apply Filters",
        project: "Project",
        category: "Category",
        funding: "Funding",
        status: "Status",
        actions: "Actions",
        weeklyImpact: "Weekly Impact",
        goal: "Goal",
        edit: "Edit",
        duplicate: "Duplicate",
        archive: "Archive",
        delete: "Delete",
        selectedActions: "Actions for selected projects",
        archiveSelected: "Archive Selected",
        deleteSelected: "Delete Selected",
        select: "Select",
        noProjects: "No weekly projects yet.",
        pageLabel: "Page",
        ofLabel: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

  const params = await searchParams;
  const q = (params.q || "").trim();
  const status = (params.status || "").trim();
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 10;

  const where = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { titleBn: { contains: q, mode: "insensitive" as const } },
            { titleEn: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)
      ? { status: status as ProjectStatus }
      : {}),
  };

  const [projects, totalCount] = await Promise.all([
    prisma.weeklyProject.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        donations: {
          where: { deletedAt: null },
          select: { amount: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.weeklyProject.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const totalTarget = projects.reduce(
    (sum, project) => sum + project.targetAmount,
    0,
  );
  const publishedCount = projects.filter(
    (project) => project.status === "PUBLISHED",
  ).length;
  const archivedCount = projects.filter(
    (project) => project.status === "ARCHIVED",
  ).length;

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (status) qp.set("status", status);
    qp.set("page", String(targetPage));
    return `/admin/weekly-projects?${qp.toString()}`;
  };

  const statusText: Record<ProjectStatus, string> = {
    DRAFT: copy.statusDraft,
    PUBLISHED: copy.statusPublished,
    ARCHIVED: copy.statusArchived,
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {copy.badge}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {copy.subtitle}
            </p>
          </div>
          <Button
            asChild
            className="h-11 rounded-full bg-[#045e6f] px-5 text-white hover:bg-[#034c5a]"
          >
            <Link href="/admin/weekly-projects/new">
              <Plus className="h-4 w-4" />
              {copy.addNewProject}
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#055763] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">
              {copy.totalActiveFunding}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">
              ৳ {totalTarget.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-white/80">{copy.acrossProjects}</p>
          </div>
          <div className="rounded-2xl border border-[#f0c5af] bg-[#fff2ea] p-4 text-[#70341f] dark:border-[#9c4f2f]/40 dark:bg-[#2b1f1a] dark:text-[#ffd1bf]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8c4d2f] dark:text-[#ffc3a8]">
              {copy.liveProjects}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">
              {publishedCount}
            </p>
            <p className="mt-1 text-xs text-[#8c4d2f] dark:text-[#ffc3a8]">
              {copy.currentlyPublished}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#eef5f8] p-4 text-slate-800 dark:border-white/10 dark:bg-[#1a2630] dark:text-slate-100">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {copy.archived}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">
              {archivedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {copy.preservedRecords}
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#dbe8f1] p-3 sm:grid-cols-2 md:grid-cols-[1fr_220px_auto] dark:border-white/10 dark:bg-[#13202a]"
        method="get"
      >
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder={copy.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
          />
        </label>
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.allStatuses}</option>
          <option value="DRAFT">{copy.statusDraft}</option>
          <option value="PUBLISHED">{copy.statusPublished}</option>
          <option value="ARCHIVED">{copy.statusArchived}</option>
        </select>
        <Button
          type="submit"
          className="h-11 rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a]"
        >
          {copy.applyFilters}
        </Button>
      </form>

      <form
        id="weekly-projects-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkSoftDeleteWeeklyProjects}
          variant="outline"
          size="sm"
        >
          {copy.archiveSelected}
        </Button>
        <Button
          type="submit"
          formAction={bulkDeleteWeeklyProjectsPermanently}
          variant="destructive"
          size="sm"
        >
          {copy.deleteSelected}
        </Button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#edf4f8] text-xs uppercase tracking-[0.14em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">{copy.select}</th>
                <th className="px-4 py-3">{copy.project}</th>
                <th className="px-4 py-3">{copy.category}</th>
                <th className="px-4 py-3">{copy.funding}</th>
                <th className="px-4 py-3">{copy.status}</th>
                <th className="px-4 py-3">{copy.actions}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const collected = project.donations.reduce(
                  (sum, item) => sum + item.amount,
                  0,
                );

                return (
                  <tr
                    key={project.id}
                    className="border-t border-slate-100 align-top dark:border-white/10"
                  >
                    <td className="px-4 py-4 align-middle">
                      <input
                        type="checkbox"
                        name="ids"
                        value={project.id}
                        form="weekly-projects-bulk-actions"
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                          {project.photos[0] ? (
                            <Image
                              src={project.photos[0]}
                              alt={project.titleEn || project.titleBn}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-300">
                              #{project.id.slice(-3).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {isBn
                              ? project.titleBn || project.titleEn
                              : project.titleEn || project.titleBn}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                            /{project.slug}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                            {project.startDate
                              ? project.startDate.toLocaleDateString()
                              : "-"}{" "}
                            -{" "}
                            {project.endDate
                              ? project.endDate.toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#ffe6da] px-2.5 py-1 text-xs font-semibold text-[#9c4f2f] dark:bg-[#3a2720] dark:text-[#ffc3a8]">
                        {copy.weeklyImpact}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        ৳ {collected.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        {copy.goal}: ৳ {project.targetAmount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={statusClass[project.status] ?? "outline"}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          project.status === "PUBLISHED" &&
                            "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/20",
                          project.status === "DRAFT" &&
                            "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/20",
                          project.status === "ARCHIVED" &&
                            "bg-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-slate-500/20 dark:text-slate-200 dark:hover:bg-slate-500/20",
                        )}
                      >
                        {statusText[project.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/weekly-projects/${project.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            {copy.edit}
                          </Link>
                        </Button>
                        <form
                          action={async () => {
                            "use server";
                            await duplicateWeeklyProject(project.id);
                          }}
                        >
                          <Button variant="outline" size="sm" type="submit">
                            {copy.duplicate}
                          </Button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await softDeleteWeeklyProject(project.id);
                          }}
                        >
                          <Button variant="destructive" size="sm" type="submit">
                            {copy.archive}
                          </Button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await deleteWeeklyProjectPermanently(project.id);
                          }}
                        >
                          <Button variant="destructive" size="sm" type="submit">
                            {copy.delete}
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {projects.length === 0 && (
          <div className="border-t border-slate-100 px-4 py-12 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
            {copy.noProjects}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600 dark:text-slate-300">
          {copy.pageLabel} {page} {copy.ofLabel} {totalPages} ({totalCount}{" "}
          {copy.items})
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" disabled={page <= 1}>
            <Link href={queryWithPage(prevPage)}>{copy.previous}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            <Link href={queryWithPage(nextPage)}>{copy.next}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
