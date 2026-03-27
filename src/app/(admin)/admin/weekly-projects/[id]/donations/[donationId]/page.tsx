import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CalendarDays,
  HandCoins,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  softDeleteWeeklyDonation,
  updateWeeklyDonation,
} from "@/actions/weekly-project";
import { getRequestLanguage } from "@/lib/language";

export default async function EditWeeklyDonationPage({
  params,
}: {
  params: Promise<{ id: string; donationId: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const { id, donationId } = await params;

  const donation = await prisma.weeklyDonation.findFirst({
    where: {
      id: donationId,
      projectId: id,
      deletedAt: null,
    },
    include: {
      project: {
        select: {
          titleBn: true,
          titleEn: true,
          targetAmount: true,
          currentAmount: true,
          donations: {
            where: { deletedAt: null },
            orderBy: { date: "desc" },
            take: 5,
            select: {
              id: true,
              donorName: true,
              amount: true,
              medium: true,
              date: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  if (!donation) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";

    const dateStr = String(formData.get("date") || "").trim();

    await updateWeeklyDonation(donationId, {
      medium: String(formData.get("medium") || donation.medium) as
        | "BKASH"
        | "NAGAD"
        | "ROCKET"
        | "BANK"
        | "OTHER",
      amount: Number(formData.get("amount") || donation.amount),
      trxid: String(formData.get("trxid") || "").trim() || undefined,
      comments: String(formData.get("comments") || "").trim() || undefined,
      donorName: String(formData.get("donorName") || "").trim() || undefined,
      phone: String(formData.get("phone") || "").trim() || undefined,
      date: dateStr ? new Date(dateStr) : donation.date,
    });

    redirect(`/admin/weekly-projects/${id}`);
  }

  async function archiveAction() {
    "use server";
    await softDeleteWeeklyDonation(donationId);
    redirect(`/admin/weekly-projects/${id}`);
  }

  const projectTitle = isBn
    ? donation.project.titleBn || donation.project.titleEn
    : donation.project.titleEn || donation.project.titleBn;
  const progress =
    donation.project.targetAmount > 0
      ? Math.min(
          100,
          Math.round(
            (donation.project.currentAmount / donation.project.targetAmount) *
              100,
          ),
        )
      : 0;

  const recentDonations = donation.project.donations.filter(
    (entry) => entry.id !== donation.id,
  );

  const dateValue = donation.date.toISOString().slice(0, 10);

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: Date) =>
    value.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const copy = isBn
    ? {
        badge: "সাপ্তাহিক প্রকল্প অনুদান",
        title: "অনুদান তথ্য সম্পাদনা",
        details: "অনুদান বিস্তারিত",
        save: "পরিবর্তন সংরক্ষণ",
        campaignGoal: "ক্যাম্পেইন লক্ষ্য",
        recentUpdates: "সাম্প্রতিক আপডেট",
        noRecent: "এই প্রকল্পে অতিরিক্ত কোনো অনুদান এখনও পাওয়া যায়নি।",
        archive: "অনুদান আর্কাইভ করুন",
      }
    : {
        badge: "Weekly Project Donation",
        title: "Edit Donation Entry",
        details: "Donation Details",
        save: "Save Changes",
        campaignGoal: "Campaign Goal",
        recentUpdates: "Recent Updates",
        noRecent: "No additional donations found for this project yet.",
        archive: "Archive Donation",
      };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 p-4 shadow-sm dark:border-white/10 dark:from-[#111c20] dark:via-[#0f171b] dark:to-[#0b2128] sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -left-20 top-16 h-52 w-52 rounded-full bg-cyan-200/20 blur-3xl dark:bg-cyan-500/15" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/15" />

      <div className="relative space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href={`/admin/weekly-projects/${id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200">
                {copy.badge}
              </span>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                {copy.title}
              </h1>
              <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
                Keep donation records clean and audit-ready. You can update
                donor details, adjust amount, and archive entries that should no
                longer appear in active campaign history.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-right backdrop-blur dark:border-white/10 dark:bg-white/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Editing For
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {projectTitle}
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-20px_rgba(8,47,73,0.35)] dark:border-white/10 dark:bg-[#101b20] sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200">
                <HandCoins className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {copy.details}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Update donation metadata and reconciliation notes.
                </p>
              </div>
            </div>

            <form action={updateAction} className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Transaction Date
                </span>
                <input
                  name="date"
                  type="date"
                  defaultValue={dateValue}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Medium
                </span>
                <select
                  name="medium"
                  defaultValue={donation.medium}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
                >
                  <option value="BKASH">BKASH</option>
                  <option value="NAGAD">NAGAD</option>
                  <option value="ROCKET">ROCKET</option>
                  <option value="BANK">BANK</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Amount (BDT)
                </span>
                <input
                  name="amount"
                  type="number"
                  min={1}
                  defaultValue={donation.amount}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  TRX ID
                </span>
                <input
                  name="trxid"
                  defaultValue={donation.trxid ?? ""}
                  placeholder="TXN982741"
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Donor Name
                </span>
                <input
                  name="donorName"
                  defaultValue={donation.donorName ?? ""}
                  placeholder="Anonymous"
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Phone
                </span>
                <input
                  name="phone"
                  defaultValue={donation.phone ?? ""}
                  placeholder="+8801XXXXXXXXX"
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Internal Comments
                </span>
                <textarea
                  name="comments"
                  rows={4}
                  defaultValue={donation.comments ?? ""}
                  placeholder="Additional reconciliation notes"
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/5"
                />
              </label>

              <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                <Button
                  type="submit"
                  className="rounded-full bg-cyan-700 px-7 hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {copy.save}
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last recorded: {formatDate(donation.date)}
                </p>
              </div>
            </form>

            <div className="mt-6 rounded-2xl border border-rose-200/80 bg-rose-50/70 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-300">
                Destructive Action
              </p>
              <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">
                Archive this donation if it was entered by mistake or should no
                longer appear in active lists.
              </p>
              <form action={archiveAction} className="mt-3">
                <Button
                  type="submit"
                  variant="destructive"
                  className="rounded-full"
                >
                  {copy.archive}
                </Button>
              </form>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101b20]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {copy.campaignGoal}
                </h3>
                <div className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {progress}%
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-teal-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Raised
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                    {formatAmount(donation.project.currentAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Target
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                    {formatAmount(donation.project.targetAmount)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101b20]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {copy.recentUpdates}
                </h3>
                <CalendarDays className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </div>

              {recentDonations.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
                  {copy.noRecent}
                </p>
              ) : (
                <div className="space-y-3">
                  {recentDonations.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {entry.donorName || "Anonymous Donor"}
                        </p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                        {formatAmount(entry.amount)} via {entry.medium}
                      </p>
                      {entry.comments ? (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                          {entry.comments}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
