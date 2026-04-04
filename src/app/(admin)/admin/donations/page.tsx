import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  bulkSoftDeleteDonations,
  duplicateDonation,
  softDeleteDonation,
} from "@/actions/donations";
import { DonationMedium, DonationType } from "@/generated/prisma/enums";
import { getRequestLanguage } from "@/lib/language";
import { BulkSelectionCount } from "@/components/admin/bulk-selection-count";
import { Copy, Pencil, Plus, Search, Trash2 } from "lucide-react";

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    medium?: string;
    page?: string;
  }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        badge: "অ্যাডমিন / ফান্ড অপারেশন",
        title: "গ্লোবাল অনুদান",
        subtitle:
          "দাতা কার্যক্রম ট্র্যাক করুন, লেনদেন যাচাই করুন, এবং ফান্ড ফ্লো রেকর্ড আপডেট রাখুন।",
        addDonation: "অনুদান যোগ করুন",
        totalDonations: "মোট অনুদান",
        inCurrentView: "বর্তমান ফিল্টার ভিউ",
        thisPageAmount: "এই পাতার পরিমাণ",
        onThisPage: "শুধু এই পাতার অনুদান",
        mediumsUsed: "মাধ্যম ব্যবহৃত",
        activeChannels: "সক্রিয় চ্যানেল",
        searchPlaceholder: "দাতা/ফোন/ট্রানজ্যাকশন দিয়ে খুঁজুন",
        allTypes: "সব ধরন",
        allMediums: "সব মাধ্যম",
        apply: "প্রয়োগ করুন",
        via: "মাধ্যম",
        donor: "দাতা",
        trxid: "লেনদেন",
        date: "তারিখ",
        edit: "এডিট",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        selectedActions: "নির্বাচিত অনুদানের অ্যাকশন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        select: "নির্বাচন",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        badge: "Admin / Fund Operations",
        title: "Global Donations",
        subtitle:
          "Track donor activity, verify transactions, and keep fund flow records current.",
        addDonation: "Add Donation",
        totalDonations: "Total Donations",
        inCurrentView: "In current filtered view",
        thisPageAmount: "This Page Amount",
        onThisPage: "Donations shown on this page",
        mediumsUsed: "Mediums Used",
        activeChannels: "Active channels",
        searchPlaceholder: "Search donor/phone/trx",
        allTypes: "All types",
        allMediums: "All mediums",
        apply: "Apply",
        via: "via",
        donor: "Donor",
        trxid: "Transaction",
        date: "Date",
        edit: "Edit",
        duplicate: "Duplicate",
        archive: "Archive",
        selectedActions: "Actions for selected donations",
        archiveSelected: "Archive Selected",
        select: "Select",
        page: "Page",
        of: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

  const params = await searchParams;
  const q = (params.q || "").trim();
  const type = (params.type || "").trim();
  const medium = (params.medium || "").trim();
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 12;

  const where = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { donorName: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { trxid: { contains: q, mode: "insensitive" as const } },
            { comments: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(type &&
    ["GENERAL", "ZAKAT", "SADAQAH", "EMERGENCY", "RAMADAN", "OTHER"].includes(
      type,
    )
      ? { type: type as DonationType }
      : {}),
    ...(medium &&
    ["BKASH", "NAGAD", "ROCKET", "EPS", "BANK", "OTHER"].includes(medium)
      ? { medium: medium as DonationMedium }
      : {}),
  };

  const [donations, totalCount] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.donation.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const thisPageAmount = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );
  const mediumsUsedCount = new Set(donations.map((donation) => donation.medium))
    .size;

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (type) qp.set("type", type);
    if (medium) qp.set("medium", medium);
    qp.set("page", String(targetPage));
    return `/admin/donations?${qp.toString()}`;
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
            <Link href="/admin/donations/new">
              <Plus className="h-4 w-4" />
              {copy.addDonation}
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#055763] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">
              {copy.totalDonations}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">{totalCount}</p>
            <p className="mt-1 text-xs text-white/80">{copy.inCurrentView}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              {copy.thisPageAmount}
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-300 sm:text-4xl">
              ৳ {thisPageAmount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
              {copy.onThisPage}
            </p>
          </div>
          <div className="rounded-2xl border border-[#ffd1bf] bg-[#fff2ea] p-4 dark:border-[#9c4f2f]/40 dark:bg-[#2b1f1a]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9c4f2f] dark:text-[#ffc3a8]">
              {copy.mediumsUsed}
            </p>
            <p className="mt-1 text-3xl font-black text-[#9c4f2f] dark:text-[#ffd1bf] sm:text-4xl">
              {mediumsUsedCount}
            </p>
            <p className="mt-1 text-xs text-[#9c4f2f]/80 dark:text-[#ffc3a8]/80">
              {copy.activeChannels}
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#dbe8f1] p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_180px_auto] dark:border-white/10 dark:bg-[#13202a]"
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
          name="type"
          defaultValue={type}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.allTypes}</option>
          <option value="GENERAL">GENERAL</option>
          <option value="ZAKAT">ZAKAT</option>
          <option value="SADAQAH">SADAQAH</option>
          <option value="EMERGENCY">EMERGENCY</option>
          <option value="RAMADAN">RAMADAN</option>
          <option value="OTHER">OTHER</option>
        </select>
        <select
          name="medium"
          defaultValue={medium}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.allMediums}</option>
          <option value="BKASH">BKASH</option>
          <option value="NAGAD">NAGAD</option>
          <option value="ROCKET">ROCKET</option>
          <option value="EPS">EPS</option>
          <option value="BANK">BANK</option>
          <option value="OTHER">OTHER</option>
        </select>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a] sm:w-auto"
        >
          {copy.apply}
        </Button>
      </form>

      <form
        id="donations-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <BulkSelectionCount
          formId="donations-bulk-actions"
          emptyLabel={copy.selectedActions}
          selectedLabelTemplate="{count} selected"
          className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300"
        />
        <Button
          type="submit"
          formAction={bulkSoftDeleteDonations}
          size="sm"
          className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          {copy.archiveSelected}
        </Button>
      </form>

      <div className="grid gap-4">
        {donations.map((donation) => (
          <article
            key={donation.id}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#0b5e7a]/40 dark:border-white/10 dark:bg-[#111a23]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-2xl font-black text-[#0b4f6d] dark:text-[#7ed4e4]">
                  ৳ {donation.amount.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {donation.type}
                  </span>{" "}
                  {copy.via} {donation.medium}
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    {copy.donor}: {donation.donorName || "-"}
                  </p>
                  <p>
                    {copy.trxid}: {donation.trxid || "-"}
                  </p>
                  <p>
                    {copy.date}: {donation.date.toISOString().slice(0, 10)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-white/15 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="ids"
                    value={donation.id}
                    form="donations-bulk-actions"
                    className="h-4 w-4"
                  />
                  {copy.select}
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-lg border-[#0c5f72] text-[#0c5f72] hover:bg-[#0c5f72] hover:text-white dark:border-[#66bdd0] dark:text-[#8dd6e4]"
                  >
                    <Link href={`/admin/donations/${donation.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                      {copy.edit}
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await duplicateDonation(donation.id);
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      type="submit"
                      className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copy.duplicate}
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await softDeleteDonation(donation.id);
                    }}
                  >
                    <Button
                      size="sm"
                      type="submit"
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
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
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
