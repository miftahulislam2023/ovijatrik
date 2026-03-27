import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  addWeeklyDonation,
  deleteWeeklyProjectPermanently,
  duplicateWeeklyProject,
  softDeleteWeeklyDonation,
  softDeleteWeeklyProject,
  updateWeeklyProject,
} from "@/actions/weekly-project";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";
import { redirect } from "next/navigation";
import { ArrowLeft, Eye, Save, Upload } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function EditWeeklyProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "সাপ্তাহিক প্রকল্প ব্যবস্থাপনা",
        editing: "সম্পাদনা:",
        projectIdentity: "প্রকল্প পরিচিতি",
        updateDonation: "চলতি অনুদান আপডেট",
        addDonation: "অনুদান যোগ করুন",
        publishingDetails: "প্রকাশনা বিবরণ",
        saveProject: "সাপ্তাহিক প্রকল্প সংরক্ষণ",
        preview: "প্রিভিউ",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        delete: "স্থায়ীভাবে মুছুন",
        edit: "এডিট",
      }
    : {
        title: "Weekly Project Management",
        editing: "Editing project:",
        projectIdentity: "Project Identity",
        updateDonation: "Update Current Donation",
        addDonation: "Add Donation",
        publishingDetails: "Publishing Details",
        saveProject: "Save Weekly Project",
        preview: "Preview Narrative",
        duplicate: "Duplicate",
        archive: "Archive",
        delete: "Delete Permanently",
        edit: "Edit",
      };

  const { id } = await params;
  const project = await prisma.weeklyProject.findFirst({
    where: { id, deletedAt: null },
    include: {
      donations: {
        where: { deletedAt: null },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    const titleBn = String(formData.get("titleBn") || "").trim();
    const titleEn = String(formData.get("titleEn") || "").trim();
    const slugInput = String(formData.get("slug") || "").trim();
    const descriptionBn = String(formData.get("descriptionBn") || "").trim();
    const descriptionEn = String(formData.get("descriptionEn") || "").trim();
    const targetAmount = Number(formData.get("targetAmount") || 0);
    const status = String(formData.get("status") || "DRAFT") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED";
    const startDateStr = String(formData.get("startDate") || "").trim();
    const endDateStr = String(formData.get("endDate") || "").trim();

    const urls = [...project.photos];

    const photoFiles = formData
      .getAll("photoFiles")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );
    for (const file of photoFiles) {
      const uploaded = await uploadImage(file, "ovijatrik/weekly-projects");
      urls.push(uploaded.url);
    }

    await updateWeeklyProject(id, {
      titleBn,
      titleEn: titleEn || undefined,
      slug: slugify(slugInput || titleEn || titleBn),
      descriptionBn,
      descriptionEn: descriptionEn || undefined,
      targetAmount,
      photos: urls,
      status,
      startDate: startDateStr ? new Date(startDateStr) : undefined,
      endDate: endDateStr ? new Date(endDateStr) : undefined,
    });
    redirect("/admin/weekly-projects");
  }

  async function deleteAction() {
    "use server";
    await softDeleteWeeklyProject(id);
    redirect("/admin/weekly-projects");
  }

  async function permanentDeleteAction() {
    "use server";
    await deleteWeeklyProjectPermanently(id);
    redirect("/admin/weekly-projects");
  }

  async function duplicateAction() {
    "use server";
    await duplicateWeeklyProject(id);
    redirect("/admin/weekly-projects");
  }

  async function addDonationAction(formData: FormData) {
    "use server";
    await addWeeklyDonation({
      projectId: id,
      medium: String(formData.get("medium") || "OTHER") as
        | "BKASH"
        | "NAGAD"
        | "ROCKET"
        | "BANK"
        | "OTHER",
      amount: Number(formData.get("amount") || 0),
      trxid: String(formData.get("trxid") || "") || undefined,
      comments: String(formData.get("comments") || "") || undefined,
      donorName: String(formData.get("donorName") || "") || undefined,
      phone: String(formData.get("phone") || "") || undefined,
      date: formData.get("date")
        ? new Date(String(formData.get("date")))
        : undefined,
    });
    redirect(`/admin/weekly-projects/${id}`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="pt-2">
        <div className="mb-2 flex items-center gap-4">
          <Link
            href="/admin/weekly-projects"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#00535b] transition-colors hover:bg-[#00535b]/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {copy.title}
          </h1>
        </div>
        <p className="ml-14 max-w-2xl text-base text-slate-600 dark:text-slate-300">
          {copy.editing}{" "}
          {isBn
            ? project.titleBn || project.titleEn
            : project.titleEn || project.titleBn}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-[#121923] dark:ring-white/10">
            <form
              id="weekly-edit-form"
              action={updateAction}
              className="space-y-6"
            >
              <h2 className="mb-2 flex items-center gap-2 font-serif text-2xl font-bold text-[#00535b]">
                {copy.projectIdentity}
              </h2>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Project Title (Bangla)
                </label>
                <input
                  name="titleBn"
                  defaultValue={project.titleBn}
                  required
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Project Title (English)
                </label>
                <input
                  name="titleEn"
                  defaultValue={project.titleEn ?? ""}
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Target Goal (BDT)
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                      ৳
                    </span>
                    <input
                      name="targetAmount"
                      type="number"
                      min={1}
                      defaultValue={project.targetAmount}
                      required
                      className="w-full rounded-lg border-none bg-[#e7f3fb] py-3 pl-8 pr-4 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={project.status}
                    className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Slug
                </label>
                <input
                  name="slug"
                  defaultValue={project.slug}
                  required
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Start Date
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    defaultValue={
                      project.startDate
                        ? project.startDate.toISOString().slice(0, 10)
                        : ""
                    }
                    className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                    End Date
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    defaultValue={
                      project.endDate
                        ? project.endDate.toISOString().slice(0, 10)
                        : ""
                    }
                    className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Detailed Description (Bangla)
                </label>
                <textarea
                  name="descriptionBn"
                  rows={8}
                  defaultValue={project.descriptionBn}
                  required
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Detailed Description (English)
                </label>
                <textarea
                  name="descriptionEn"
                  rows={8}
                  defaultValue={project.descriptionEn ?? ""}
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>

              <label className="group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#bec8ca] bg-[#e7f3fb] px-4 text-center transition-colors hover:border-[#00535b] dark:bg-[#182534]">
                <Upload className="mb-2 h-8 w-8 text-[#00535b]" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Upload extra photos
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Recommended: 1920x1080 (PNG, JPG)
                </p>
                <input
                  name="photoFiles"
                  type="file"
                  multiple
                  accept="image/*"
                  className="mt-4 w-full text-xs"
                />
              </label>
            </form>
          </section>

          <section className="rounded-xl bg-[#e7f3fb] p-8 ring-1 ring-[#d5e5ef] dark:bg-[#182534] dark:ring-white/10">
            <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-[#8c4e35]">
              {copy.updateDonation}
            </h2>
            <form
              action={addDonationAction}
              className="grid gap-4 md:grid-cols-2"
            >
              <select
                name="medium"
                className="rounded-lg border-none bg-white px-4 py-3 focus:ring-2 focus:ring-[#8c4e35] dark:bg-[#0f1620]"
              >
                <option value="BKASH">BKASH</option>
                <option value="NAGAD">NAGAD</option>
                <option value="ROCKET">ROCKET</option>
                <option value="BANK">BANK</option>
                <option value="OTHER">OTHER</option>
              </select>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                  ৳
                </span>
                <input
                  name="amount"
                  type="number"
                  min={1}
                  required
                  placeholder="0.00"
                  className="w-full rounded-lg border-none bg-white py-3 pl-8 pr-4 focus:ring-2 focus:ring-[#8c4e35] dark:bg-[#0f1620]"
                />
              </div>
              <input
                name="trxid"
                placeholder="TRX ID (optional)"
                className="rounded-lg border-none bg-white px-4 py-3 focus:ring-2 focus:ring-[#8c4e35] dark:bg-[#0f1620]"
              />
              <input
                name="phone"
                placeholder="Phone (optional)"
                className="rounded-lg border-none bg-white px-4 py-3 focus:ring-2 focus:ring-[#8c4e35] dark:bg-[#0f1620]"
              />
              <input
                name="donorName"
                placeholder="Donor name (optional)"
                className="rounded-lg border-none bg-white px-4 py-3 focus:ring-2 focus:ring-[#8c4e35] dark:bg-[#0f1620]"
              />
              <input
                name="date"
                type="date"
                className="rounded-lg border-none bg-white px-4 py-3 focus:ring-2 focus:ring-[#8c4e35] dark:bg-[#0f1620]"
              />
              <input
                name="comments"
                placeholder="Comments"
                className="rounded-lg border-none bg-white px-4 py-3 md:col-span-2 focus:ring-2 focus:ring-[#8c4e35] dark:bg-[#0f1620]"
              />
              <Button
                type="submit"
                className="w-fit rounded-full bg-[#8c4e35] px-6 text-white hover:bg-[#7a432d]"
              >
                {copy.addDonation}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-sm">
              {project.donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200 dark:bg-[#0f1620] dark:ring-white/10"
                >
                  <p>
                    {donation.amount} BDT - {donation.medium} -{" "}
                    {donation.donorName || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={`/admin/weekly-projects/${id}/donations/${donation.id}`}
                      >
                        {copy.edit}
                      </Link>
                    </Button>
                    <form
                      action={async () => {
                        "use server";
                        await softDeleteWeeklyDonation(donation.id);
                      }}
                    >
                      <Button type="submit" size="sm" variant="destructive">
                        {copy.archive}
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-1">
          <section className="rounded-xl bg-[#daebf5] p-6 ring-1 ring-[#d5e5ef] dark:bg-[#1a2533] dark:ring-white/10">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {copy.publishingDetails}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-300/50 py-2 dark:border-white/10">
                <span className="text-slate-600 dark:text-slate-300">
                  Status
                </span>
                <span className="rounded-md bg-[#ffad8f] px-2 py-1 text-xs font-semibold text-[#793f27]">
                  {project.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600 dark:text-slate-300">
                  Last Saved
                </span>
                <span className="italic text-slate-500">
                  {project.updatedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </section>

          <Button
            type="submit"
            form="weekly-edit-form"
            className="w-full rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] py-6 text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99]"
          >
            <Save className="h-4 w-4" />
            {copy.saveProject}
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-2 border-[#bec8ca] py-6 text-slate-700 hover:bg-slate-50 dark:text-slate-200"
          >
            <Link href={`/weekly-projects/${project.slug}`}>
              <Eye className="h-4 w-4" />
              {copy.preview}
            </Link>
          </Button>

          <form action={duplicateAction}>
            <Button className="w-full" variant="outline" type="submit">
              {copy.duplicate}
            </Button>
          </form>
          <form action={deleteAction}>
            <Button className="w-full" variant="destructive" type="submit">
              {copy.archive}
            </Button>
          </form>
          <form action={permanentDeleteAction}>
            <Button className="w-full" variant="destructive" type="submit">
              {copy.delete}
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
