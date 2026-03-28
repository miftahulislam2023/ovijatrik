import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  softDeleteVolunteerApplication,
  updateVolunteerApplication,
} from "@/actions/volunteers";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default async function VolunteerApplicationDetailPage({
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
      }
    : {
        save: "Save Changes",
        archive: "Archive Application",
      };

  const { id } = await params;
  const application = await prisma.volunteerApplication.findFirst({
    where: { id, deletedAt: null },
  });

  if (!application) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    await updateVolunteerApplication(id, {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim() || null,
      address: String(formData.get("address") || "").trim() || null,
      availability: String(formData.get("availability") || "").trim() || null,
      interests: String(formData.get("interests") || "").trim() || null,
      experience: String(formData.get("experience") || "").trim() || null,
      motivation: String(formData.get("motivation") || "").trim(),
      status: String(formData.get("status") || "PENDING") as
        | "PENDING"
        | "APPROVED"
        | "REJECTED",
    });

    redirect("/admin/volunteers");
  }

  async function deleteAction() {
    "use server";
    await softDeleteVolunteerApplication(id);
    redirect("/admin/volunteers");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121923]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/volunteers"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {isBn ? "ভলান্টিয়ার আবেদন" : "Volunteer Application"}
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
            form="volunteer-edit-form"
            className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
          >
            <Save className="h-4 w-4" />
            {copy.save}
          </Button>
        </div>
      </header>

      <form
        id="volunteer-edit-form"
        action={updateAction}
        className="space-y-5 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 dark:border-white/10 dark:bg-[#121d29]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            defaultValue={application.name}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            required
          />
          <input
            name="phone"
            defaultValue={application.phone}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            required
          />
          <input
            name="email"
            defaultValue={application.email ?? ""}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <input
            name="address"
            defaultValue={application.address ?? ""}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <input
            name="availability"
            defaultValue={application.availability ?? ""}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <input
            name="interests"
            defaultValue={application.interests ?? ""}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <select
            name="status"
            defaultValue={application.status}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <textarea
            name="experience"
            rows={4}
            defaultValue={application.experience ?? ""}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <textarea
            name="motivation"
            rows={4}
            defaultValue={application.motivation}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            required
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
