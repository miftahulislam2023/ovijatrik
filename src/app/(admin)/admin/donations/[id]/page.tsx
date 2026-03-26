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

export default async function EditDonationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <Card>
      <CardHeader>
        <CardTitle>Edit Donation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={updateAction} className="grid gap-4 md:grid-cols-2">
          <select
            name="medium"
            defaultValue={donation.medium}
            className="rounded-md border border-input px-3 py-2"
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
            className="rounded-md border border-input px-3 py-2"
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
            className="rounded-md border border-input px-3 py-2"
            required
          />
          <input
            name="date"
            type="date"
            defaultValue={donation.date.toISOString().slice(0, 10)}
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="donorName"
            defaultValue={donation.donorName ?? ""}
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="phone"
            defaultValue={donation.phone ?? ""}
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="trxid"
            defaultValue={donation.trxid ?? ""}
            className="rounded-md border border-input px-3 py-2 md:col-span-2"
          />
          <textarea
            name="comments"
            rows={4}
            defaultValue={donation.comments ?? ""}
            className="rounded-md border border-input px-3 py-2 md:col-span-2"
          />
          <Button type="submit" className="w-full md:col-span-2 md:w-fit">
            Save Changes
          </Button>
        </form>
        <div className="flex flex-wrap gap-3">
          <form action={duplicateAction}>
            <Button type="submit" variant="outline">
              Duplicate
            </Button>
          </form>
          <form action={deleteAction}>
            <Button type="submit" variant="destructive">
              Archive
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
