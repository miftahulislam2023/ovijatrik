import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        subtitle: "View donor segmentation by recurring frequency and update preferences.",
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
  const campaignAlerts =
    ((params.campaignAlerts || "") as BooleanFilter) || "";
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

  const [users, totalCount, totalDonorUsers, monthlyCount, quarterlyCount, yearlyCount] =
    await Promise.all([
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
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {copy.pageTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 lg:grid-cols-5"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder={copy.searchPlaceholder}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        />

        <select
          name="frequency"
          defaultValue={frequency}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">{copy.frequency}: {copy.all}</option>
          <option value="MONTHLY">{copy.monthlyDonors}</option>
          <option value="QUARTERLY">{copy.quarterlyDonors}</option>
          <option value="YEARLY">{copy.yearlyDonors}</option>
        </select>

        <select
          name="weeklyDigest"
          defaultValue={weeklyDigest}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">{copy.weeklyDigest}: {copy.all}</option>
          <option value="true">{copy.yes}</option>
          <option value="false">{copy.no}</option>
        </select>

        <select
          name="campaignAlerts"
          defaultValue={campaignAlerts}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">{copy.campaignAlerts}: {copy.all}</option>
          <option value="true">{copy.yes}</option>
          <option value="false">{copy.no}</option>
        </select>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {copy.apply}
          </Button>
          <Button asChild type="button" variant="outline" className="flex-1">
            <Link href="/admin/donor-segments">{copy.clear}</Link>
          </Button>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {copy.totalDonors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalDonorUsers.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {copy.monthlyDonors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{monthlyCount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {copy.quarterlyDonors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{quarterlyCount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {copy.yearlyDonors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{yearlyCount.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{copy.listTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">{copy.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-2 py-2 font-semibold">{copy.user}</th>
                    <th className="px-2 py-2 font-semibold">{copy.preferredAmount}</th>
                    <th className="px-2 py-2 font-semibold">{copy.preferredFrequency}</th>
                    <th className="px-2 py-2 font-semibold">{copy.digest}</th>
                    <th className="px-2 py-2 font-semibold">{copy.alerts}</th>
                    <th className="px-2 py-2 font-semibold">{copy.lastUpdated}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border/60">
                      <td className="px-2 py-2">
                        <p className="font-medium">{user.name || "-"}</p>
                        <p className="text-xs text-muted-foreground">{user.email || "-"}</p>
                      </td>
                      <td className="px-2 py-2">
                        {user.preferredDonationAmount
                          ? `${user.preferredDonationAmount.toLocaleString()} BDT`
                          : "-"}
                      </td>
                      <td className="px-2 py-2">{toFrequencyLabel(user.preferredDonationFrequency)}</td>
                      <td className="px-2 py-2">{user.receiveWeeklyDigest ? copy.yes : copy.no}</td>
                      <td className="px-2 py-2">{user.receiveCampaignAlerts ? copy.yes : copy.no}</td>
                      <td className="px-2 py-2">{user.updatedAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {copy.page} {page} {copy.of} {totalPages} ({totalCount} {copy.items})
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" disabled={page <= 1}>
            <Link href={queryWithPage(Math.max(1, page - 1))}>{copy.previous}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            <Link href={queryWithPage(Math.min(totalPages, page + 1))}>{copy.next}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
