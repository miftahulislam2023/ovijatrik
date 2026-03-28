import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { getRequestLanguage } from "@/lib/language";
import {
  bulkDeleteTubewellProjectsPermanently,
  bulkSoftDeleteTubewellProjects,
  deleteTubewellProjectPermanently,
  duplicateTubewellProject,
  softDeleteTubewellProject,
} from "@/actions/tubewell-project";
import { Pencil, Plus, Search } from "lucide-react";

export default async function TubewellProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; year?: string; page?: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";

  const copy = isBn
    ? {
        badge: "ইমপ্যাক্ট কন্ট্রোল",
        title: "টিউবওয়েল প্রকল্প",
        subtitle:
          "জেলা-ভিত্তিক পানি অবকাঠামো প্রকল্প মনিটর করুন এবং প্রকাশনা প্রস্তুতি ট্র্যাক করুন।",
        addNewProject: "নতুন প্রকল্প যোগ করুন",
        totalWells: "মোট টিউবওয়েল",
        entriesInArchive: "এই আর্কাইভের মোট এন্ট্রি",
        activeDistricts: "সক্রিয় জেলা",
        representedOnPage: "এই পাতায় উপস্থিত",
        yearFilter: "বছর ফিল্টার",
        currentArchiveSlice: "বর্তমান আর্কাইভ ভিউ",
        all: "সব",
        searchPlaceholder: "শিরোনাম, স্লাগ, লোকেশন দিয়ে খুঁজুন",
        allYears: "সব বছর",
        applyFilters: "ফিল্টার প্রয়োগ করুন",
        projectId: "প্রকল্প আইডি",
        location: "লোকেশন",
        completion: "সমাপ্তির তারিখ",
        status: "স্ট্যাটাস",
        actions: "অ্যাকশন",
        completed: "সম্পন্ন",
        edit: "এডিট",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        delete: "ডিলিট",
        selectedActions: "নির্বাচিত প্রকল্পের অ্যাকশন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        deleteSelected: "নির্বাচিত ডিলিট",
        select: "নির্বাচন",
        noProjects: "এখনও কোনো টিউবওয়েল প্রকল্প নেই।",
        pageLabel: "পৃষ্ঠা",
        ofLabel: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        badge: "Impact Control",
        title: "Tubewell Projects",
        subtitle:
          "Monitor water infrastructure deployments across districts and track publication readiness.",
        addNewProject: "Add New Project",
        totalWells: "Total Wells",
        entriesInArchive: "Entries in this archive",
        activeDistricts: "Active Districts",
        representedOnPage: "Represented on this page",
        yearFilter: "Year Filter",
        currentArchiveSlice: "Current archive slice",
        all: "All",
        searchPlaceholder: "Search title, slug, location",
        allYears: "All years",
        applyFilters: "Apply Filters",
        projectId: "Project ID",
        location: "Location",
        completion: "Completion",
        status: "Status",
        actions: "Actions",
        completed: "COMPLETED",
        edit: "Edit",
        duplicate: "Duplicate",
        archive: "Archive",
        delete: "Delete",
        selectedActions: "Actions for selected projects",
        archiveSelected: "Archive Selected",
        deleteSelected: "Delete Selected",
        select: "Select",
        noProjects: "No tubewell projects yet.",
        pageLabel: "Page",
        ofLabel: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

  const params = await searchParams;
  const q = (params.q || "").trim();
  const year = Number(params.year || "");
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
            { location: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(Number.isFinite(year) && year > 0 ? { year } : {}),
  };

  const [projects, totalCount] = await Promise.all([
    prisma.tubewellProject.findMany({
      where,
      orderBy: [{ year: "desc" }, { completionDate: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tubewellProject.count({ where }),
  ]);

  const years = await prisma.tubewellProject.findMany({
    where: { deletedAt: null },
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" },
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const districtCount = new Set(projects.map((project) => project.location))
    .size;

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (params.year) qp.set("year", params.year);
    qp.set("page", String(targetPage));
    return `/admin/tubewell-projects?${qp.toString()}`;
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
            className="h-11 rounded-2xl bg-[#045e6f] px-5 text-white hover:bg-[#034c5a]"
          >
            <Link href="/admin/tubewell-projects/new">
              <Plus className="h-4 w-4" />
              {copy.addNewProject}
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#005f72] bg-white p-4 dark:border-[#0f7186]/70 dark:bg-[#142730]">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              {copy.totalWells}
            </p>
            <p className="mt-1 text-3xl font-black text-[#014f60] dark:text-[#7ed4e4] sm:text-4xl">
              {totalCount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {copy.entriesInArchive}
            </p>
          </div>
          <div className="rounded-2xl border border-[#d9a98f] bg-[#fff4ee] p-4 dark:border-[#a96f57]/60 dark:bg-[#2f221d]">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              {copy.activeDistricts}
            </p>
            <p className="mt-1 text-3xl font-black text-[#8a3a1d] dark:text-[#ffb899] sm:text-4xl">
              {districtCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {copy.representedOnPage}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#eef5f8] p-4 dark:border-white/10 dark:bg-[#1a2630]">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              {copy.yearFilter}
            </p>
            <p className="mt-1 text-3xl font-black text-slate-800 dark:text-slate-100 sm:text-4xl">
              {params.year || copy.all}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {copy.currentArchiveSlice}
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
          name="year"
          defaultValue={params.year || ""}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.allYears}</option>
          {years.map((item) => (
            <option key={item.year} value={item.year}>
              {item.year}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          className="h-11 rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a]"
        >
          {copy.applyFilters}
        </Button>
      </form>

      <form
        id="tubewell-projects-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkSoftDeleteTubewellProjects}
          variant="outline"
          size="sm"
        >
          {copy.archiveSelected}
        </Button>
        <Button
          type="submit"
          formAction={bulkDeleteTubewellProjectsPermanently}
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
                <th className="px-4 py-3">{copy.projectId}</th>
                <th className="px-4 py-3">{copy.location}</th>
                <th className="px-4 py-3">{copy.completion}</th>
                <th className="px-4 py-3">{copy.status}</th>
                <th className="px-4 py-3">{copy.actions}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-t border-slate-100 align-top dark:border-white/10"
                >
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="checkbox"
                      name="ids"
                      value={project.id}
                      form="tubewell-projects-bulk-actions"
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    #TW-{project.year}-{project.id.slice(-3).toUpperCase()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                        {project.photos[0] ? (
                          <Image
                            src={project.photos[0]}
                            alt={project.titleEn || project.titleBn}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {isBn
                            ? project.titleBn || project.titleEn
                            : project.titleEn || project.titleBn}
                        </p>
                        <p className="text-xs text-slate-500">
                          {project.location}
                        </p>
                        <p className="text-xs text-slate-500">
                          /{project.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                    {project.completionDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      {copy.completed}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/tubewell-projects/${project.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                          {copy.edit}
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await duplicateTubewellProject(project.id);
                        }}
                      >
                        <Button variant="outline" size="sm" type="submit">
                          {copy.duplicate}
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await softDeleteTubewellProject(project.id);
                        }}
                      >
                        <Button variant="destructive" size="sm" type="submit">
                          {copy.archive}
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await deleteTubewellProjectPermanently(project.id);
                        }}
                      >
                        <Button variant="destructive" size="sm" type="submit">
                          {copy.delete}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {projects.length === 0 && (
          <div className="border-t border-slate-100 px-4 py-12 text-center text-sm text-slate-500 dark:border-white/10">
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
