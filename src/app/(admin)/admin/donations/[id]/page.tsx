import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  duplicateDonation,
  softDeleteDonation,
  updateDonation,
} from "@/actions/donations";
import { redirect } from "next/navigation";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { ArrowLeft, Copy, Pencil, Save, Trash2 } from "lucide-react";

export default async function EditDonationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        badge: "ফান্ড অপারেশন",
        title: "অনুদান সম্পাদনা",
        subtitle: "সংরক্ষিত অনুদানের তথ্য আপডেট করুন এবং রেকর্ড সঠিক রাখুন।",
        editing: "সম্পাদনা চলছে",
        donationSetup: "অনুদান সেটআপ",
        donorDetails: "দাতা ও লেনদেন তথ্য",
        amount: "পরিমাণ",
        donorName: "দাতার নাম",
        phone: "ফোন",
        trxId: "ট্রানজ্যাকশন আইডি",
        comments: "মন্তব্য",
        save: "পরিবর্তন সংরক্ষণ",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
      }
    : {
        badge: "Fund Operations",
        title: "Edit Donation",
        subtitle: "Update captured donation details to keep records accurate.",
        editing: "Editing",
        donationSetup: "Donation Setup",
        donorDetails: "Donor & Transaction Details",
        amount: "Amount",
        donorName: "Donor name",
        phone: "Phone",
        trxId: "TRX ID",
        comments: "Comments",
        save: "Save Changes",
        duplicate: "Duplicate",
        archive: "Archive",
      };

  const { id } = await params;
  const donation = await prisma.donation.findFirst({
    where: { id, deletedAt: null },
  });

  if (!donation) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    await updateDonation(id, {
      medium: String(formData.get("medium") || "OTHER") as
        | "BKASH"
        | "NAGAD"
        | "ROCKET"
        | "EPS"
        | "BANK"
        | "OTHER",
      amount: Number(formData.get("amount") || 0),
      trxid: String(formData.get("trxid") || "") || undefined,
      comments: String(formData.get("comments") || "") || undefined,
      phone: String(formData.get("phone") || "") || undefined,
      donorName: String(formData.get("donorName") || "") || undefined,
      type: String(formData.get("type") || "GENERAL") as
        | "GENERAL"
        | "ZAKAT"
        | "SADAQAH"
        | "EMERGENCY"
        | "RAMADAN"
        | "OTHER",
      date: new Date(
        String(formData.get("date") || donation.date.toISOString()),
      ),
    });
    redirect("/admin/donations");
  }

  async function duplicateAction() {
    "use server";
    await duplicateDonation(id);
    redirect("/admin/donations");
  }

  async function deleteAction() {
    "use server";
    await softDeleteDonation(id);
    redirect("/admin/donations");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121923]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/donations"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.badge}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {copy.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {copy.subtitle}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {copy.editing}: {donation.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <form action={duplicateAction}>
            <Button
              type="submit"
              variant="outline"
              className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <Copy className="h-4 w-4" />
              {copy.duplicate}
            </Button>
          </form>
          <form action={deleteAction}>
            <Button
              type="submit"
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              {copy.archive}
            </Button>
          </form>
          <Button
            type="submit"
            form="donation-edit-form"
            className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
          >
            <Save className="h-4 w-4" />
            {copy.save}
          </Button>
        </div>
      </header>

      <form
        id="donation-edit-form"
        action={updateAction}
        className="grid gap-6 lg:grid-cols-[1fr_300px]"
      >
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 dark:border-white/10 dark:bg-[#121d29]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.donationSetup}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <select
                name="medium"
                defaultValue={donation.medium}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              >
                <option value="BKASH">BKASH</option>
                <option value="NAGAD">NAGAD</option>
                <option value="ROCKET">ROCKET</option>
                <option value="EPS">EPS</option>
                <option value="BANK">BANK</option>
                <option value="OTHER">OTHER</option>
              </select>
              <select
                name="type"
                defaultValue={donation.type}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              >
                <option value="GENERAL">GENERAL</option>
                <option value="ZAKAT">ZAKAT</option>
                <option value="SADAQAH">SADAQAH</option>
                <option value="EMERGENCY">EMERGENCY</option>
                <option value="RAMADAN">RAMADAN</option>
                <option value="OTHER">OTHER</option>
              </select>
              <input
                name="amount"
                type="number"
                min={1}
                defaultValue={donation.amount}
                placeholder={copy.amount}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
                required
              />
              <input
                name="date"
                type="date"
                defaultValue={donation.date.toISOString().slice(0, 10)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.donorDetails}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="donorName"
                defaultValue={donation.donorName ?? ""}
                placeholder={copy.donorName}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <input
                name="phone"
                defaultValue={donation.phone ?? ""}
                placeholder={copy.phone}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <input
                name="trxid"
                defaultValue={donation.trxid ?? ""}
                placeholder={copy.trxId}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <textarea
                name="comments"
                rows={4}
                defaultValue={donation.comments ?? ""}
                placeholder={copy.comments}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#121923]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.trxId}
            </p>
            <p className="mt-2 text-sm font-semibold text-[#123e6c] dark:text-[#8dd6e4]">
              {donation.trxid || "-"}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {copy.amount}: ৳ {donation.amount.toLocaleString()}
            </p>
          </div>

          <Button
            type="submit"
            form="donation-edit-form"
            className="w-full rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] py-6 text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99]"
          >
            <Pencil className="h-4 w-4" />
            {copy.save}
          </Button>
        </aside>
      </form>
    </div>
  );
}
