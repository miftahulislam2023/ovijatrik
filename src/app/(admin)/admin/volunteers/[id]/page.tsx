import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  softDeleteVolunteerApplication,
  updateVolunteerApplication,
} from "@/actions/volunteers";
import { getRequestLanguage } from "@/lib/language";

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
    <Card className="dark:border-white/10 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          {application.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={updateAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            defaultValue={application.name}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <input
            name="phone"
            defaultValue={application.phone}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <input
            name="email"
            defaultValue={application.email ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="address"
            defaultValue={application.address ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="availability"
            defaultValue={application.availability ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="interests"
            defaultValue={application.interests ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <select
            name="status"
            defaultValue={application.status}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <textarea
            name="experience"
            rows={4}
            defaultValue={application.experience ?? ""}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <textarea
            name="motivation"
            rows={4}
            defaultValue={application.motivation}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
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
