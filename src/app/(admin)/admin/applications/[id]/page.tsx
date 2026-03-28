import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  softDeleteApplication,
  updateApplication,
} from "@/actions/applications";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

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
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121923]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/applications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {isBn ? "আবেদন সম্পাদনা" : "Application Edit"}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {application.name}
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
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
            form="application-edit-form"
            className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
          >
            <Save className="h-4 w-4" />
            {copy.save}
          </Button>
        </div>
      </header>

      <form
        id="application-edit-form"
        action={updateAction}
        className="space-y-5 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 dark:border-white/10 dark:bg-[#121d29]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="sr-only" htmlFor="name">
            {copy.name}
          </label>
          <input
            id="name"
            name="name"
            defaultValue={application.name}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            required
          />
          <label className="sr-only" htmlFor="phone">
            {copy.phone}
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={application.phone}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            required
          />
          <label className="sr-only" htmlFor="email">
            {copy.email}
          </label>
          <input
            id="email"
            name="email"
            defaultValue={application.email ?? ""}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <label className="sr-only" htmlFor="address">
            {copy.address}
          </label>
          <input
            id="address"
            name="address"
            defaultValue={application.address ?? ""}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <select
            name="status"
            defaultValue={application.status}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
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
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
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
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <Button
            type="submit"
            className="w-full rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] py-6 text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99] md:col-span-2 md:w-fit"
          >
            {copy.save}
          </Button>
        </div>
      </form>
    </div>
  );
}
