import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  duplicateDonation,
  softDeleteDonation,
  updateDonation,
} from "@/actions/donations";
import { redirect } from "next/navigation";
import { getRequestLanguage } from "@/lib/language";

export default async function EditDonationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "অনুদান সম্পাদনা",
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
        title: "Edit Donation",
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
    <Card className="dark:border-white/10 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          {copy.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={updateAction} className="grid gap-4 md:grid-cols-2">
          <select
            name="medium"
            defaultValue={donation.medium}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="BKASH">BKASH</option>
            <option value="NAGAD">NAGAD</option>
            <option value="ROCKET">ROCKET</option>
            <option value="BANK">BANK</option>
            <option value="OTHER">OTHER</option>
          </select>
          <select
            name="type"
            defaultValue={donation.type}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
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
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <input
            name="date"
            type="date"
            defaultValue={donation.date.toISOString().slice(0, 10)}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="donorName"
            defaultValue={donation.donorName ?? ""}
            placeholder={copy.donorName}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="phone"
            defaultValue={donation.phone ?? ""}
            placeholder={copy.phone}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="trxid"
            defaultValue={donation.trxid ?? ""}
            placeholder={copy.trxId}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <textarea
            name="comments"
            rows={4}
            defaultValue={donation.comments ?? ""}
            placeholder={copy.comments}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button type="submit" className="w-full md:col-span-2 md:w-fit">
            {copy.save}
          </Button>
        </form>
        <div className="flex flex-wrap gap-3">
          <form action={duplicateAction}>
            <Button type="submit" variant="outline">
              {copy.duplicate}
            </Button>
          </form>
          <form action={deleteAction}>
            <Button type="submit" variant="destructive">
              {copy.archive}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
