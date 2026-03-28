import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Droplets,
  FolderKanban,
  HandCoins,
  HeartHandshake,
  Users,
} from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function labelFromMonthKey(key: string) {
  const [year, month] = key.split("-");
  return `${month}/${year}`;
}

function monthShortLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMedium(medium: string) {
  return medium.charAt(0) + medium.slice(1).toLowerCase();
}

function formatRelativeTime(date: Date) {
  const now = Date.now();
  const diffSeconds = Math.round((date.getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const mins = Math.round(diffSeconds / 60);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");

  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return rtf.format(days, "day");

  const months = Math.round(days / 30);
  return rtf.format(months, "month");
}

function getTrend(current: number, previous: number) {
  if (previous === 0 && current > 0) {
    return { delta: 100, direction: "up" as const };
  }
  if (previous === 0) {
    return { delta: 0, direction: "flat" as const };
  }

  const delta = Math.round(((current - previous) / previous) * 100);
  if (delta > 0) return { delta, direction: "up" as const };
  if (delta < 0) return { delta: Math.abs(delta), direction: "down" as const };
  return { delta: 0, direction: "flat" as const };
}

export default async function AdminDashboardPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";

  const [
    globalDonations,
    weeklyDonations,
    weeklyProjectsForProgress,
    latestWeeklyProjects,
    weeklyProjectCount,
    publishedWeeklyProjectCount,
    tubewellProjects,
    latestTubewellProjects,
    donationTypeGroups,
    completedTubewells,
    volunteerCount,
    latestVolunteerApplications,
    unreadMessageCount,
    latestMessages,
  ] = await Promise.all([
    prisma.donation.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        amount: true,
        date: true,
        phone: true,
        donorName: true,
        medium: true,
      },
    }),
    prisma.weeklyDonation.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        amount: true,
        date: true,
        phone: true,
        donorName: true,
        medium: true,
        project: {
          select: {
            titleEn: true,
            titleBn: true,
          },
        },
      },
    }),
    prisma.weeklyProject.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        titleBn: true,
        titleEn: true,
        targetAmount: true,
        currentAmount: true,
      },
    }),
    prisma.weeklyProject.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        titleEn: true,
        titleBn: true,
        createdAt: true,
      },
    }),
    prisma.weeklyProject.count({ where: { deletedAt: null } }),
    prisma.weeklyProject.count({
      where: { deletedAt: null, status: "PUBLISHED" },
    }),
    prisma.tubewellProject.findMany({
      where: { deletedAt: null },
      select: { year: true },
    }),
    prisma.tubewellProject.findMany({
      where: { deletedAt: null },
      orderBy: { completionDate: "desc" },
      take: 3,
      select: {
        titleEn: true,
        titleBn: true,
        location: true,
        completionDate: true,
      },
    }),
    prisma.donation.groupBy({
      by: ["type"],
      where: { deletedAt: null },
      _sum: { amount: true },
    }),
    prisma.tubewellProject.count({ where: { deletedAt: null } }),
    prisma.volunteerApplication.count({ where: { deletedAt: null } }),
    prisma.volunteerApplication.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: {
        name: true,
        createdAt: true,
      },
    }),
    prisma.message.count({ where: { deletedAt: null, readAt: null } }),
    prisma.message.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: {
        name: true,
        subject: true,
        createdAt: true,
      },
    }),
  ]);

  const totalGlobal = globalDonations.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalWeekly = weeklyDonations.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalDonations = totalGlobal + totalWeekly;

  const uniquePhones = new Set(
    [...globalDonations, ...weeklyDonations]
      .map((item) => item.phone?.trim())
      .filter((phone): phone is string => !!phone),
  );

  const monthlyMap = new Map<string, number>();
  for (const entry of [...globalDonations, ...weeklyDonations]) {
    const key = monthKey(entry.date);
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + entry.amount);
  }

  const monthlyDonations = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([key, amount]) => ({
      label: labelFromMonthKey(key),
      shortLabel: monthShortLabel(key),
      amount,
    }));

  const latestMonth = monthlyDonations.at(-1)?.amount ?? 0;
  const previousMonth = monthlyDonations.at(-2)?.amount ?? 0;
  const donationTrend = getTrend(latestMonth, previousMonth);

  const donationTypeData = donationTypeGroups
    .map((item) => ({
      type: item.type,
      amount: item._sum.amount ?? 0,
    }))
    .filter((item) => item.amount > 0);

  const weeklyProgress = weeklyProjectsForProgress.map((item) => ({
    title: (item.titleEn || item.titleBn).slice(0, 18),
    target: item.targetAmount,
    current: item.currentAmount,
    percent: item.targetAmount
      ? Math.min(
          100,
          Math.round((item.currentAmount / item.targetAmount) * 100),
        )
      : 0,
  }));

  const topWeeklyProgress = weeklyProgress.slice(0, 5);

  const tubewellYearMap = new Map<number, number>();
  for (const item of tubewellProjects) {
    tubewellYearMap.set(item.year, (tubewellYearMap.get(item.year) ?? 0) + 1);
  }
  const tubewellByYear = Array.from(tubewellYearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, count]) => ({ year: String(year), count }));

  const highestTubewellYear = tubewellByYear.reduce(
    (acc, curr) => (curr.count > acc.count ? curr : acc),
    { year: "-", count: 0 },
  );

  const donationRows = [
    ...globalDonations.map((item) => ({
      id: item.id,
      donor:
        item.donorName?.trim() || (isBn ? "নাম প্রকাশে অনিচ্ছুক" : "Anonymous"),
      amount: item.amount,
      medium: formatMedium(item.medium),
      date: item.date,
      source: "Global" as const,
      status: "Verified" as const,
    })),
    ...weeklyDonations.map((item) => ({
      id: item.id,
      donor:
        item.donorName?.trim() || (isBn ? "নাম প্রকাশে অনিচ্ছুক" : "Anonymous"),
      amount: item.amount,
      medium: formatMedium(item.medium),
      date: item.date,
      source: isBn
        ? item.project.titleBn || item.project.titleEn || "Weekly"
        : item.project.titleEn || item.project.titleBn || "Weekly",
      status: "Verified" as const,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const latestDonation = donationRows[0];

  const recentActivity = [
    ...(latestTubewellProjects[0]
      ? [
          {
            title: "Tubewell completion recorded",
            details: `${latestTubewellProjects[0].titleEn || latestTubewellProjects[0].titleBn} in ${latestTubewellProjects[0].location}.`,
            at: latestTubewellProjects[0].completionDate,
            tone: "primary" as const,
          },
        ]
      : []),
    ...(latestDonation
      ? [
          {
            title: "Latest donation received",
            details: `${latestDonation.donor} donated ${formatCurrency(latestDonation.amount)} BDT via ${latestDonation.medium}.`,
            at: latestDonation.date,
            tone: "green" as const,
          },
        ]
      : []),
    ...(latestVolunteerApplications[0]
      ? [
          {
            title: "New volunteer application",
            details: `${latestVolunteerApplications[0].name} submitted a volunteer form.`,
            at: latestVolunteerApplications[0].createdAt,
            tone: "amber" as const,
          },
        ]
      : []),
    ...(latestMessages[0]
      ? [
          {
            title: "New inbound message",
            details: `${latestMessages[0].name}: ${latestMessages[0].subject || "No subject"}.`,
            at: latestMessages[0].createdAt,
            tone: "slate" as const,
          },
        ]
      : []),
    ...(latestWeeklyProjects[0]
      ? [
          {
            title: "Weekly project created",
            details: `${latestWeeklyProjects[0].titleEn || latestWeeklyProjects[0].titleBn} added to the pipeline.`,
            at: latestWeeklyProjects[0].createdAt,
            tone: "primary" as const,
          },
        ]
      : []),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 5);

  const maxMonthly = Math.max(
    ...monthlyDonations.map((item) => item.amount),
    1,
  );

  const typeShare = donationTypeData
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4)
    .map((item) => ({
      ...item,
      percent:
        totalGlobal > 0 ? Math.round((item.amount / totalGlobal) * 100) : 0,
    }));

  const activityDotClass = {
    primary: "bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.45)]",
    green: "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.45)]",
    amber: "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.45)]",
    slate: "bg-slate-500 shadow-[0_0_20px_rgba(100,116,139,0.45)]",
  };

  const copy = isBn
    ? {
        overview: "অপারেশনাল সারাংশ",
        dashboard: "ইমপ্যাক্ট কন্ট্রোল ড্যাশবোর্ড",
        totalDonations: "মোট অনুদান",
        uniqueDonors: "স্বতন্ত্র দাতা",
        weeklyProjects: "সাপ্তাহিক প্রকল্প",
        tubewellProjects: "টিউবওয়েল প্রকল্প",
        donationTrends: "অনুদান প্রবণতা",
        recentActivity: "সাম্প্রতিক কার্যক্রম",
        noRecentActivity: "সাম্প্রতিক কোনো কার্যক্রম পাওয়া যায়নি।",
        recentDonations: "সাম্প্রতিক অনুদান",
        donor: "দাতা",
        amount: "পরিমাণ",
        medium: "মাধ্যম",
        source: "উৎস",
        date: "তারিখ",
        status: "স্ট্যাটাস",
        noRows: "কোনো অনুদান সারি পাওয়া যায়নি।",
        operations: "অপারেশন স্ন্যাপশট",
      }
    : {
        overview: "Operational Overview",
        dashboard: "Impact Control Dashboard",
        totalDonations: "Total Donations",
        uniqueDonors: "Unique Donors",
        weeklyProjects: "Weekly Projects",
        tubewellProjects: "Tubewell Projects",
        donationTrends: "Donation Trends",
        recentActivity: "Recent Activity",
        noRecentActivity: "No recent activity found.",
        recentDonations: "Recent Donations",
        donor: "Donor",
        amount: "Amount",
        medium: "Medium",
        source: "Source",
        date: "Date",
        status: "Status",
        noRows: "No donation rows available.",
        operations: "Operations Snapshot",
      };

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="rounded-3xl border border-slate-200/70 bg-linear-to-br from-white via-slate-50 to-sky-50 p-4 shadow-sm dark:border-white/10 dark:from-[#151f2b] dark:via-[#0f1622] dark:to-[#111b27] sm:p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {copy.overview}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              {copy.dashboard}
            </h1>
            <p className="mt-2 max-w-2xl text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
              Real-time insight across donations, projects, volunteers, and
              communications.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            Updated{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="min-w-0 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111723] sm:p-5">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-xl bg-blue-100 p-2 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
              <HandCoins className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
              {donationTrend.direction === "down" ? (
                <ArrowDownRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5" />
              )}
              {donationTrend.delta}%
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300">
            {copy.totalDonations}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {formatCurrency(totalDonations)} BDT
          </p>
        </article>

        <article className="min-w-0 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111723] sm:p-5">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-xl bg-violet-100 p-2 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
              <Users className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              Reach
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300">
            {copy.uniqueDonors}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {uniquePhones.size.toLocaleString()}
          </p>
        </article>

        <article className="min-w-0 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111723] sm:p-5">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-xl bg-orange-100 p-2 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">
              <FolderKanban className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              {publishedWeeklyProjectCount}/{weeklyProjectCount} published
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300">
            {copy.weeklyProjects}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {weeklyProjectCount.toLocaleString()}
          </p>
        </article>

        <article className="min-w-0 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111723] sm:p-5">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
              <Droplets className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              Peak {highestTubewellYear.year}
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300">
            {copy.tubewellProjects}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {completedTubewells.toLocaleString()}
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="min-w-0 rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111723] sm:p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {copy.donationTrends}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                Last seven monthly snapshots from global + weekly donations
              </p>
            </div>
            <Badge className="rounded-full bg-blue-600 px-3 py-1 text-white hover:bg-blue-600">
              Monthly
            </Badge>
          </div>

          <div className="flex h-56 items-end gap-2 sm:gap-3">
            {monthlyDonations.map((month) => {
              const normalized = Math.max(
                10,
                Math.round((month.amount / maxMonthly) * 100),
              );
              return (
                <div
                  key={month.label}
                  className="group flex h-full flex-1 flex-col justify-end"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-t-xl bg-blue-100/70 dark:bg-blue-900/30">
                    <div
                      className="absolute bottom-0 w-full rounded-t-xl bg-linear-to-t from-blue-700 to-blue-500 transition-all duration-500 group-hover:opacity-85"
                      style={{ height: `${normalized}%` }}
                    />
                  </div>
                  <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                    {month.shortLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-3xl border border-slate-200/70 bg-slate-50 p-4 shadow-sm dark:border-white/10 dark:bg-[#0f1a28] sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {copy.recentActivity}
          </h2>
          <div className="mt-5 space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {copy.noRecentActivity}
              </p>
            ) : (
              recentActivity.map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${activityDotClass[entry.tone]}`}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white sm:text-sm">
                      {entry.title}
                    </p>
                    <p className="mt-1 break-words text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xs">
                      {entry.details}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">
                      {formatRelativeTime(entry.at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <article className="min-w-0 rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111723] sm:p-6 xl:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {copy.recentDonations}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                Unified stream from global and weekly donation schemas
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs sm:text-sm"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{copy.donor}</TableHead>
                  <TableHead>{copy.amount}</TableHead>
                  <TableHead>{copy.medium}</TableHead>
                  <TableHead>{copy.source}</TableHead>
                  <TableHead>{copy.date}</TableHead>
                  <TableHead>{copy.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donationRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      {copy.noRows}
                    </TableCell>
                  </TableRow>
                ) : (
                  donationRows.map((row) => (
                    <TableRow key={`${row.source}-${row.id}`}>
                      <TableCell className="font-medium">{row.donor}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(row.amount)} BDT
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-full">
                          {row.medium}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[11rem] truncate">
                        {row.source}
                      </TableCell>
                      <TableCell>
                        {row.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600">
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </article>

        <article className="space-y-4 rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111723] sm:p-6 xl:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {copy.operations}
          </h2>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300">
              Top Donation Types
            </p>
            <div className="mt-3 space-y-3">
              {typeShare.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  No donation type data yet.
                </p>
              ) : (
                typeShare.map((item) => (
                  <div key={item.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
                      <span>{item.type}</span>
                      <span>{item.percent}%</span>
                    </div>
                    <Progress value={item.percent} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-300">
              Weekly Project Progress
            </p>
            <div className="mt-3 space-y-3">
              {topWeeklyProgress.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  No weekly projects to show.
                </p>
              ) : (
                topWeeklyProgress.map((item) => (
                  <div key={item.title} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
                      <span className="truncate">{item.title}</span>
                      <span className="font-semibold">{item.percent}%</span>
                    </div>
                    <Progress value={item.percent} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                Volunteers
              </p>
              <p className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <HeartHandshake className="h-4 w-4 text-violet-500" />
                {volunteerCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                Unread Messages
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {unreadMessageCount.toLocaleString()}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
