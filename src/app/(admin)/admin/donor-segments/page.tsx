import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type FrequencyFilter = "" | "MONTHLY" | "QUARTERLY" | "YEARLY";
type BooleanFilter = "" | "true" | "false";

export default async function AdminDonorSegmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    frequency?: string;
    weeklyDigest?: string;
    campaignAlerts?: string;
    page?: string;
  }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";

  const copy = isBn
    ? {
        pageTitle: "ডোনার সেগমেন্টস",
        subtitle: "ফ্রিকোয়েন্সি ও আপডেট পছন্দ অনুযায়ী দাতাদের সেগমেন্ট দেখুন।",
        searchPlaceholder: "নাম বা ইমেইল দিয়ে খুঁজুন",
        frequency: "ফ্রিকোয়েন্সি",
        weeklyDigest: "সাপ্তাহিক ডাইজেস্ট",
        campaignAlerts: "ক্যাম্পেইন এলার্ট",
        all: "সব",
        yes: "হ্যাঁ",
        no: "না",
        apply: "প্রয়োগ",
        clear: "রিসেট",
        totalDonors: "মোট ডোনার ব্যবহারকারী",
        monthlyDonors: "মাসিক",
        quarterlyDonors: "ত্রৈমাসিক",
        yearlyDonors: "বার্ষিক",
        listTitle: "ডোনার তালিকা",
        empty: "কোনো ডোনার পাওয়া যায়নি।",
        user: "ব্যবহারকারী",
        preferredAmount: "পছন্দের পরিমাণ",
        preferredFrequency: "পছন্দের ফ্রিকোয়েন্সি",
        digest: "ডাইজেস্ট",
        alerts: "এলার্ট",
        lastUpdated: "সর্বশেষ আপডেট",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        pageTitle: "Donor Segments",
        subtitle:
          "View donor segmentation by recurring frequency and update preferences.",
        searchPlaceholder: "Search by name or email",
        frequency: "Frequency",
        weeklyDigest: "Weekly digest",
        campaignAlerts: "Campaign alerts",
        all: "All",
        yes: "Yes",
        no: "No",
        apply: "Apply",
        clear: "Clear",
        totalDonors: "Total donor users",
        monthlyDonors: "Monthly",
        quarterlyDonors: "Quarterly",
        yearlyDonors: "Yearly",
        listTitle: "Donor list",
        empty: "No donor users found.",
        user: "User",
        preferredAmount: "Preferred amount",
        preferredFrequency: "Preferred frequency",
        digest: "Digest",
        alerts: "Alerts",
        lastUpdated: "Last updated",
        page: "Page",
        of: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

  const params = await searchParams;
  const q = (params.q || "").trim();
  const frequency = ((params.frequency || "") as FrequencyFilter) || "";
  const weeklyDigest = ((params.weeklyDigest || "") as BooleanFilter) || "";
  const campaignAlerts = ((params.campaignAlerts || "") as BooleanFilter) || "";
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 12;

  const where = {
    role: "user",
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(frequency ? { preferredDonationFrequency: frequency } : {}),
    ...(weeklyDigest ? { receiveWeeklyDigest: weeklyDigest === "true" } : {}),
    ...(campaignAlerts
      ? { receiveCampaignAlerts: campaignAlerts === "true" }
      : {}),
  };

  const [
    users,
    totalCount,
    totalDonorUsers,
    monthlyCount,
    quarterlyCount,
    yearlyCount,
  ] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        preferredDonationAmount: true,
        preferredDonationFrequency: true,
        receiveWeeklyDigest: true,
        receiveCampaignAlerts: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
    prisma.user.count({ where: { role: "user" } }),
    prisma.user.count({
      where: { role: "user", preferredDonationFrequency: "MONTHLY" },
    }),
    prisma.user.count({
      where: { role: "user", preferredDonationFrequency: "QUARTERLY" },
    }),
    prisma.user.count({
      where: { role: "user", preferredDonationFrequency: "YEARLY" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const toFrequencyLabel = (value: string | null) => {
    if (!value) return "-";
    if (value === "MONTHLY") return copy.monthlyDonors;
    if (value === "QUARTERLY") return copy.quarterlyDonors;
    if (value === "YEARLY") return copy.yearlyDonors;
    return value;
  };

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (frequency) qp.set("frequency", frequency);
    if (weeklyDigest) qp.set("weeklyDigest", weeklyDigest);
    if (campaignAlerts) qp.set("campaignAlerts", campaignAlerts);
    qp.set("page", String(targetPage));
    return `/admin/donor-segments?${qp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
            {isBn
              ? "অ্যাডমিন / ডোনার অ্যানালিটিক্স"
              : "Admin / Donor Analytics"}
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
            {copy.pageTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {copy.subtitle}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-[#055763] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">
              {copy.totalDonors}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">
              {totalDonorUsers.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              {copy.monthlyDonors}
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-300 sm:text-4xl">
              {monthlyCount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/50 dark:bg-amber-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
              {copy.quarterlyDonors}
            </p>
            <p className="mt-1 text-3xl font-black text-amber-700 dark:text-amber-300 sm:text-4xl">
              {quarterlyCount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-[#ffd1bf] bg-[#fff2ea] p-4 dark:border-[#9c4f2f]/40 dark:bg-[#2b1f1a]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9c4f2f] dark:text-[#ffc3a8]">
              {copy.yearlyDonors}
            </p>
            <p className="mt-1 text-3xl font-black text-[#9c4f2f] dark:text-[#ffd1bf] sm:text-4xl">
              {yearlyCount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#dbe8f1] p-3 sm:grid-cols-2 lg:grid-cols-5 dark:border-white/10 dark:bg-[#13202a]"
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
          name="frequency"
          defaultValue={frequency}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">
            {copy.frequency}: {copy.all}
          </option>
          <option value="MONTHLY">{copy.monthlyDonors}</option>
          <option value="QUARTERLY">{copy.quarterlyDonors}</option>
          <option value="YEARLY">{copy.yearlyDonors}</option>
        </select>

        <select
          name="weeklyDigest"
          defaultValue={weeklyDigest}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">
            {copy.weeklyDigest}: {copy.all}
          </option>
          <option value="true">{copy.yes}</option>
          <option value="false">{copy.no}</option>
        </select>

        <select
          name="campaignAlerts"
          defaultValue={campaignAlerts}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">
            {copy.campaignAlerts}: {copy.all}
          </option>
          <option value="true">{copy.yes}</option>
          <option value="false">{copy.no}</option>
        </select>

        <div className="flex gap-2">
          <Button
            type="submit"
            className="h-11 flex-1 rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a]"
          >
            {copy.apply}
          </Button>
          <Button
            asChild
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href="/admin/donor-segments">{copy.clear}</Link>
          </Button>
        </div>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {copy.listTitle}
        </h2>
        {users.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {copy.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="px-2 py-2 font-semibold">{copy.user}</th>
                  <th className="px-2 py-2 font-semibold">
                    {copy.preferredAmount}
                  </th>
                  <th className="px-2 py-2 font-semibold">
                    {copy.preferredFrequency}
                  </th>
                  <th className="px-2 py-2 font-semibold">{copy.digest}</th>
                  <th className="px-2 py-2 font-semibold">{copy.alerts}</th>
                  <th className="px-2 py-2 font-semibold">
                    {copy.lastUpdated}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200/70 dark:border-white/10"
                  >
                    <td className="px-2 py-2">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {user.name || "-"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.email || "-"}
                      </p>
                    </td>
                    <td className="px-2 py-2">
                      {user.preferredDonationAmount
                        ? `${user.preferredDonationAmount.toLocaleString()} BDT`
                        : "-"}
                    </td>
                    <td className="px-2 py-2">
                      {toFrequencyLabel(user.preferredDonationFrequency)}
                    </td>
                    <td className="px-2 py-2">
                      {user.receiveWeeklyDigest ? copy.yes : copy.no}
                    </td>
                    <td className="px-2 py-2">
                      {user.receiveCampaignAlerts ? copy.yes : copy.no}
                    </td>
                    <td className="px-2 py-2">
                      {user.updatedAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
            <Link href={queryWithPage(Math.max(1, page - 1))}>
              {copy.previous}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href={queryWithPage(Math.min(totalPages, page + 1))}>
              {copy.next}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
