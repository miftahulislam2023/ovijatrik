import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  softDeleteApplication,
  updateApplication,
} from "@/actions/applications";
import { getRequestLanguage } from "@/lib/language";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        save: "পরিবর্তন সংরক্ষণ",
        archive: "আবেদন আর্কাইভ করুন",
        name: "নাম",
        phone: "ফোন",
        email: "ইমেইল",
        address: "ঠিকানা",
        reason: "কারণ",
        details: "বিস্তারিত",
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
      }
    : {
        save: "Save Changes",
        archive: "Archive Application",
        name: "Name",
        phone: "Phone",
        email: "Email",
        address: "Address",
        reason: "Reason",
        details: "Details",
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
      };

  const { id } = await params;
  const application = await prisma.application.findFirst({
    where: { id, deletedAt: null },
  });

  if (!application) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    await updateApplication(id, {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim() || null,
      address: String(formData.get("address") || "").trim() || null,
      reason: String(formData.get("reason") || "").trim(),
      details: String(formData.get("details") || "").trim() || null,
      status: String(formData.get("status") || "PENDING") as
        | "PENDING"
        | "APPROVED"
        | "REJECTED",
    });
    redirect("/admin/applications");
  }

  async function deleteAction() {
    "use server";
    await softDeleteApplication(id);
    redirect("/admin/applications");
  }

  return (
    <Card className="dark:border-white/10 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          {application.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={updateAction} className="grid gap-4 md:grid-cols-2">
          <label className="sr-only" htmlFor="name">
            {copy.name}
          </label>
          <input
            id="name"
            name="name"
            defaultValue={application.name}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <label className="sr-only" htmlFor="phone">
            {copy.phone}
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={application.phone}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <label className="sr-only" htmlFor="email">
            {copy.email}
          </label>
          <input
            id="email"
            name="email"
            defaultValue={application.email ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <label className="sr-only" htmlFor="address">
            {copy.address}
          </label>
          <input
            id="address"
            name="address"
            defaultValue={application.address ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <select
            name="status"
            defaultValue={application.status}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="PENDING">{copy.pending}</option>
            <option value="APPROVED">{copy.approved}</option>
            <option value="REJECTED">{copy.rejected}</option>
          </select>
          <label className="sr-only" htmlFor="reason">
            {copy.reason}
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            defaultValue={application.reason}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <label className="sr-only" htmlFor="details">
            {copy.details}
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            defaultValue={application.details ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button type="submit" className="w-full md:col-span-2 md:w-fit">
            {copy.save}
          </Button>
        </form>
        <form action={deleteAction}>
          <Button type="submit" variant="destructive">
            {copy.archive}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
