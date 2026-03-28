import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  bulkSoftDeleteDonations,
  duplicateDonation,
  softDeleteDonation,
} from "@/actions/donations";
import { DonationMedium, DonationType } from "@/generated/prisma/enums";
import { getRequestLanguage } from "@/lib/language";

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
        title: "গ্লোবাল অনুদান",
        addDonation: "অনুদান যোগ করুন",
        searchPlaceholder: "দাতা/ফোন/ট্রানজ্যাকশন দিয়ে খুঁজুন",
        allTypes: "সব ধরন",
        allMediums: "সব মাধ্যম",
        apply: "প্রয়োগ করুন",
        via: "মাধ্যম",
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
        title: "Global Donations",
        addDonation: "Add Donation",
        searchPlaceholder: "Search donor/phone/trx",
        allTypes: "All types",
        allMediums: "All mediums",
        apply: "Apply",
        via: "via",
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
    ...(medium && ["BKASH", "NAGAD", "ROCKET", "BANK", "OTHER"].includes(medium)
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {copy.title}
        </h1>
        <Button asChild>
          <Link href="/admin/donations/new">{copy.addDonation}</Link>
        </Button>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_180px_auto]"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder={copy.searchPlaceholder}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        />
        <select
          name="type"
          defaultValue={type}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
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
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">{copy.allMediums}</option>
          <option value="BKASH">BKASH</option>
          <option value="NAGAD">NAGAD</option>
          <option value="ROCKET">ROCKET</option>
          <option value="BANK">BANK</option>
          <option value="OTHER">OTHER</option>
        </select>
        <Button type="submit" className="w-full sm:w-auto">
          {copy.apply}
        </Button>
      </form>

      <form
        id="donations-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkSoftDeleteDonations}
          variant="destructive"
          size="sm"
        >
          {copy.archiveSelected}
        </Button>
      </form>

      <div className="grid gap-4">
        {donations.map((donation) => (
          <Card key={donation.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                  {donation.amount.toLocaleString()} BDT
                </CardTitle>
                <label className="inline-flex items-center gap-2 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    name="ids"
                    value={donation.id}
                    form="donations-bulk-actions"
                    className="h-4 w-4"
                  />
                  {copy.select}
                </label>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <p className="text-muted-foreground">
                {donation.type} {copy.via} {donation.medium}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/donations/${donation.id}`}>
                    {copy.edit}
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await duplicateDonation(donation.id);
                  }}
                >
                  <Button variant="outline" size="sm" type="submit">
                    {copy.duplicate}
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await softDeleteDonation(donation.id);
                  }}
                >
                  <Button variant="destructive" size="sm" type="submit">
                    {copy.archive}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
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
