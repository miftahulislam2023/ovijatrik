import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { softDeleteVolunteerApplication } from "@/actions/volunteers";
import { AppStatus } from "@/generated/prisma/enums";
import { Search, UserRound } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function AdminVolunteersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
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
            { interests: { contains: q, mode: "insensitive" as const } },
            { motivation: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status && ["PENDING", "APPROVED", "REJECTED"].includes(status)
      ? { status: status as AppStatus }
      : {}),
  };

  const [applications, totalCount] = await Promise.all([
    prisma.volunteerApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.volunteerApplication.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const approvedCount = applications.filter(
    (entry) => entry.status === "APPROVED",
  ).length;
  const pendingCount = applications.filter(
    (entry) => entry.status === "PENDING",
  ).length;

  const statusPill: Record<AppStatus, string> = {
    APPROVED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    PENDING:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    REJECTED:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  };

  const copy = isBn
    ? {
        badge: "প্রভাব নেটওয়ার্ক",
        title: "স্বেচ্ছাসেবক ডিরেক্টরি",
        subtitle:
          "সক্রিয় উদ্যোগে যুক্ত স্বেচ্ছাসেবকদের অনবোর্ডিং ও প্রস্তুতি তদারকি করুন।",
        exportCsv: "CSV এক্সপোর্ট",
        totalEntries: "মোট এন্ট্রি",
        tracked: "ট্র্যাককৃত আবেদন",
        approved: "অনুমোদিত",
        ready: "কাজের জন্য প্রস্তুত",
        pending: "অপেক্ষমাণ",
        awaitingReview: "রিভিউয়ের অপেক্ষায়",
        search: "নাম, ফোন, আগ্রহ দিয়ে খুঁজুন",
        allStatuses: "সব স্ট্যাটাস",
        statusPending: "অপেক্ষমাণ",
        statusApproved: "অনুমোদিত",
        statusRejected: "প্রত্যাখ্যাত",
        applyFilters: "ফিল্টার প্রয়োগ করুন",
        volunteer: "স্বেচ্ছাসেবক",
        contact: "যোগাযোগ",
        joined: "যোগদানের তারিখ",
        interest: "আগ্রহ",
        status: "স্ট্যাটাস",
        actions: "অ্যাকশন",
        fieldAdvocate: "ফিল্ড অ্যাডভোকেট",
        applicant: "আবেদনকারী",
        general: "সাধারণ",
        view: "দেখুন",
        archive: "আর্কাইভ",
        noData: "কোনো স্বেচ্ছাসেবক আবেদন পাওয়া যায়নি।",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        badge: "Impact Network",
        title: "Volunteer Directory",
        subtitle:
          "Oversee onboarding and readiness of advocates across active initiatives.",
        exportCsv: "Export CSV",
        totalEntries: "Total Entries",
        tracked: "Applications tracked",
        approved: "Approved",
        ready: "Ready for deployment",
        pending: "Pending",
        awaitingReview: "Awaiting review",
        search: "Search name, phone, interests",
        allStatuses: "All statuses",
        statusPending: "Pending",
        statusApproved: "Approved",
        statusRejected: "Rejected",
        applyFilters: "Apply Filters",
        volunteer: "Volunteer",
        contact: "Contact",
        joined: "Joined",
        interest: "Interest",
        status: "Status",
        actions: "Actions",
        fieldAdvocate: "Field Advocate",
        applicant: "Applicant",
        general: "General",
        view: "View",
        archive: "Archive",
        noData: "No volunteer applications found.",
        page: "Page",
        of: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (status) qp.set("status", status);
    qp.set("page", String(targetPage));
    return `/admin/volunteers?${qp.toString()}`;
  };

  const statusText: Record<AppStatus, string> = {
    PENDING: copy.statusPending,
    APPROVED: copy.statusApproved,
    REJECTED: copy.statusRejected,
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
            variant="outline"
            className="h-11 rounded-xl border-[#0c5f72] text-[#0c5f72] hover:bg-[#0c5f72] hover:text-white dark:border-[#66bdd0] dark:text-[#8dd6e4]"
          >
            <Link href="/admin/volunteers">{copy.exportCsv}</Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#055763] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">
              {copy.totalEntries}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">{totalCount}</p>
            <p className="mt-1 text-xs text-white/80">{copy.tracked}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              {copy.approved}
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-300 sm:text-4xl">
              {approvedCount}
            </p>
            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
              {copy.ready}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/50 dark:bg-amber-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
              {copy.pending}
            </p>
            <p className="mt-1 text-3xl font-black text-amber-700 dark:text-amber-300 sm:text-4xl">
              {pendingCount}
            </p>
            <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-300/80">
              {copy.awaitingReview}
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
            placeholder={copy.search}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
          />
        </label>
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.allStatuses}</option>
          <option value="PENDING">{copy.statusPending}</option>
          <option value="APPROVED">{copy.statusApproved}</option>
          <option value="REJECTED">{copy.statusRejected}</option>
        </select>
        <Button
          type="submit"
          className="h-11 rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a]"
        >
          {copy.applyFilters}
        </Button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#edf4f8] text-xs uppercase tracking-[0.14em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">{copy.volunteer}</th>
                <th className="px-4 py-3">{copy.contact}</th>
                <th className="px-4 py-3">{copy.joined}</th>
                <th className="px-4 py-3">{copy.interest}</th>
                <th className="px-4 py-3">{copy.status}</th>
                <th className="px-4 py-3">{copy.actions}</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-t border-slate-100 align-top dark:border-white/10"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d7e6ef] text-[#0c5f72] dark:bg-[#1f3340] dark:text-[#8dd6e4]">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {application.name}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#a95b37] dark:text-[#ffc3a8]">
                          {application.status === "APPROVED"
                            ? copy.fieldAdvocate
                            : copy.applicant}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                    <p>{application.email || "-"}</p>
                    <p className="text-xs text-slate-500">
                      {application.phone || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                    {application.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#ffe6da] px-2.5 py-1 text-xs font-semibold text-[#9c4f2f] dark:bg-[#3a2720] dark:text-[#ffc3a8]">
                      {application.interests || copy.general}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusPill[application.status]}`}
                    >
                      {statusText[application.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/volunteers/${application.id}`}>
                          {copy.view}
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await softDeleteVolunteerApplication(application.id);
                        }}
                      >
                        <Button type="submit" variant="destructive" size="sm">
                          {copy.archive}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="border-t border-slate-100 px-4 py-12 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
            {copy.noData}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600 dark:text-slate-300">
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
