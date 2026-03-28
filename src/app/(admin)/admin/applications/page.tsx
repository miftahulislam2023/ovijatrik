import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  bulkSoftDeleteApplications,
  softDeleteApplication,
} from "@/actions/applications";
import { AppStatus } from "@/generated/prisma/enums";
import { getRequestLanguage } from "@/lib/language";

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
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        {copy.pageTitle}
      </h1>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_auto]"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder={copy.searchPlaceholder}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">{copy.allStatuses}</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <Button type="submit" className="w-full sm:w-auto">
          {copy.apply}
        </Button>
      </form>

      <form
        id="applications-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkSoftDeleteApplications}
          variant="destructive"
          size="sm"
        >
          {copy.archiveSelected}
        </Button>
      </form>

      <div className="grid gap-4">
        {applications.map((application) => (
          <Card
            key={application.id}
            className="transition hover:border-primary"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                  {application.name}
                </CardTitle>
                <label className="inline-flex items-center gap-2 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    name="ids"
                    value={application.id}
                    form="applications-bulk-actions"
                    className="h-4 w-4"
                  />
                  {copy.select}
                </label>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                {application.phone} - {application.status}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/applications/${application.id}`}>
                    {copy.view}
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await softDeleteApplication(application.id);
                  }}
                >
                  <Button type="submit" variant="destructive" size="sm">
                    {copy.archive}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              {copy.noData}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {copy.page} {page} {copy.of} {totalPages} ({totalCount} {copy.items})
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
