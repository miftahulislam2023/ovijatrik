import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  softDeleteWeeklyDonation,
  updateWeeklyDonation,
} from "@/actions/weekly-project";

export default async function EditWeeklyDonationPage({
  params,
}: {
  params: Promise<{ id: string; donationId: string }>;
}) {
  const { id, donationId } = await params;

  const donation = await prisma.weeklyDonation.findFirst({
    where: {
      id: donationId,
      projectId: id,
      deletedAt: null,
    },
  });

  if (!donation) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";

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
    });

    redirect(`/admin/weekly-projects/${id}`);
  }

  async function archiveAction() {
    "use server";
    await softDeleteWeeklyDonation(donationId);
    redirect(`/admin/weekly-projects/${id}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Donation Entry</CardTitle>
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
          <input
            name="amount"
            type="number"
            min={1}
            defaultValue={donation.amount}
            className="rounded-md border border-input px-3 py-2"
            required
          />
          <input
            name="donorName"
            defaultValue={donation.donorName ?? ""}
            placeholder="Donor name"
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="phone"
            defaultValue={donation.phone ?? ""}
            placeholder="Phone"
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="trxid"
            defaultValue={donation.trxid ?? ""}
            placeholder="TRX ID"
            className="rounded-md border border-input px-3 py-2 md:col-span-2"
          />
          <textarea
            name="comments"
            rows={4}
            defaultValue={donation.comments ?? ""}
            placeholder="Comments"
            className="rounded-md border border-input px-3 py-2 md:col-span-2"
          />
          <Button type="submit" className="w-full md:col-span-2 md:w-fit">
            Save Changes
          </Button>
        </form>

        <form action={archiveAction}>
          <Button type="submit" variant="destructive">
            Archive Donation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
