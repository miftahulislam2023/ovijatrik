import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  bulkSoftDeleteApplications,
  softDeleteApplication,
} from "@/actions/applications";
import { AppStatus } from "@/generated/prisma/enums";
import { getRequestLanguage } from "@/lib/language";
import { Eye, Search, Trash2 } from "lucide-react";

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        pageTitle: "অনুদান আবেদনসমূহ",
        searchPlaceholder: "নাম, ফোন, কারণ দিয়ে খুঁজুন",
        allStatuses: "সব স্ট্যাটাস",
        apply: "প্রয়োগ করুন",
        view: "দেখুন",
        archive: "আর্কাইভ",
        selectedActions: "নির্বাচিত আবেদনের অ্যাকশন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        select: "নির্বাচন",
        noData: "কোনো আবেদন পাওয়া যায়নি।",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        pageTitle: "Donation Applications",
        searchPlaceholder: "Search name, phone, reason",
        allStatuses: "All statuses",
        apply: "Apply",
        view: "View",
        archive: "Archive",
        selectedActions: "Actions for selected applications",
        archiveSelected: "Archive Selected",
        select: "Select",
        noData: "No applications found.",
        page: "Page",
        of: "of",
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
            { name: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { reason: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status && ["PENDING", "APPROVED", "REJECTED"].includes(status)
      ? { status: status as AppStatus }
      : {}),
  };

  const [applications, totalCount] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.application.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (status) qp.set("status", status);
    qp.set("page", String(targetPage));
    return `/admin/applications?${qp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {isBn
                ? "অ্যাডমিন / আবেদন ম্যানেজমেন্ট"
                : "Admin / Application Management"}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              {copy.pageTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {isBn
                ? "আবেদন যাচাই, স্ট্যাটাস আপডেট এবং ফলো-আপ এক জায়গা থেকে পরিচালনা করুন।"
                : "Review submissions, update statuses, and manage follow-up from one place."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#055763] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">
              {isBn ? "মোট আবেদন" : "Total Applications"}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">{totalCount}</p>
            <p className="mt-1 text-xs text-white/80">
              {isBn ? "বর্তমান ফিল্টার ভিউ" : "In current filtered view"}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              {isBn ? "অনুমোদিত" : "Approved"}
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-300 sm:text-4xl">
              {applications.filter((item) => item.status === "APPROVED").length}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/50 dark:bg-amber-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
              {isBn ? "অপেক্ষমাণ" : "Pending"}
            </p>
            <p className="mt-1 text-3xl font-black text-amber-700 dark:text-amber-300 sm:text-4xl">
              {applications.filter((item) => item.status === "PENDING").length}
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#dbe8f1] p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_auto] dark:border-white/10 dark:bg-[#13202a]"
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
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a] sm:w-auto"
        >
          {copy.apply}
        </Button>
      </form>

      <form
        id="applications-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkSoftDeleteApplications}
          size="sm"
          className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          {copy.archiveSelected}
        </Button>
      </form>

      <div className="grid gap-4">
        {applications.map((application) => (
          <article
            key={application.id}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#0b5e7a]/40 dark:border-white/10 dark:bg-[#111a23]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {application.name}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {application.phone}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {application.status}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-white/15 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="ids"
                    value={application.id}
                    form="applications-bulk-actions"
                    className="h-4 w-4"
                  />
                  {copy.select}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-[#0c5f72] text-[#0c5f72] hover:bg-[#0c5f72] hover:text-white dark:border-[#66bdd0] dark:text-[#8dd6e4]"
                  >
                    <Link href={`/admin/applications/${application.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      {copy.view}
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await softDeleteApplication(application.id);
                    }}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {copy.archive}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </article>
        ))}

        {applications.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-[#111a23] dark:text-slate-300">
            {copy.noData}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500 dark:text-slate-300">
          {copy.page} {page} {copy.of} {totalPages} ({totalCount} {copy.items})
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page <= 1}
            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href={queryWithPage(prevPage)}>{copy.previous}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href={queryWithPage(nextPage)}>{copy.next}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
