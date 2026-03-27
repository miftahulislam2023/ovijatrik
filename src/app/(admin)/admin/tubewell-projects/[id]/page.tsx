import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  deleteTubewellProjectPermanently,
  duplicateTubewellProject,
  softDeleteTubewellProject,
  updateTubewellProject,
} from "@/actions/tubewell-project";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function EditTubewellProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        editBadge: "টিউবওয়েল সম্পাদনা",
        project: "প্রকল্প",
        publish: "প্রকল্প প্রকাশ",
        coreInfo: "মূল তথ্য",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        delete: "স্থায়ীভাবে মুছুন",
      }
    : {
        editBadge: "Edit Tubewell",
        project: "Project",
        publish: "Publish Project",
        coreInfo: "Core Information",
        duplicate: "Duplicate",
        archive: "Archive",
        delete: "Delete Permanently",
      };

  const { id } = await params;
  const project = await prisma.tubewellProject.findFirst({
    where: { id, deletedAt: null },
  });

  if (!project) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";

    const titleBn = String(formData.get("titleBn") || "").trim();
    const titleEn = String(formData.get("titleEn") || "").trim();
    const slugInput = String(formData.get("slug") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const completionDateStr = String(
      formData.get("completionDate") || "",
    ).trim();
    const impactSummary = String(formData.get("impactSummary") || "").trim();

    const completionDate = completionDateStr
      ? new Date(completionDateStr)
      : project.completionDate;

    const urls = [...project.photos];

    const photoFiles = formData
      .getAll("photoFiles")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );
    for (const file of photoFiles) {
      const uploaded = await uploadImage(file, "ovijatrik/tubewell-projects");
      urls.push(uploaded.url);
    }

    await updateTubewellProject(id, {
      titleBn,
      titleEn: titleEn || undefined,
      slug: slugify(slugInput || titleEn || titleBn),
      location,
      descriptionBn: description,
      descriptionEn: description,
      photos: urls,
      completionDate,
      year: completionDate.getFullYear(),
      impactSummary: impactSummary || undefined,
    });

    redirect("/admin/tubewell-projects");
  }

  async function duplicateAction() {
    "use server";
    await duplicateTubewellProject(id);
    redirect("/admin/tubewell-projects");
  }

  async function deleteAction() {
    "use server";
    await softDeleteTubewellProject(id);
    redirect("/admin/tubewell-projects");
  }

  async function permanentDeleteAction() {
    "use server";
    await deleteTubewellProjectPermanently(id);
    redirect("/admin/tubewell-projects");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/tubewell-projects"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121923] dark:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {copy.editBadge}
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              {copy.project} {project.slug}
            </h1>
          </div>
        </div>
        <Button
          type="submit"
          form="tubewell-edit-form"
          className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
        >
          <Save className="h-4 w-4" />
          {copy.publish}
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121923]">
          <form
            id="tubewell-edit-form"
            action={updateAction}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-[#0f5f79]">
              {copy.coreInfo}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="titleBn"
                defaultValue={project.titleBn}
                required
                className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <input
                name="titleEn"
                defaultValue={project.titleEn ?? ""}
                className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <input
                name="slug"
                defaultValue={project.slug}
                required
                className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 dark:border-white/10 dark:bg-[#0f1620]"
              />
              <input
                name="location"
                defaultValue={project.location}
                required
                className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <input
                name="completionDate"
                type="date"
                defaultValue={project.completionDate.toISOString().slice(0, 10)}
                required
                className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
              />
            </div>

            <textarea
              name="description"
              rows={6}
              defaultValue={
                isBn
                  ? project.descriptionBn || project.descriptionEn
                  : project.descriptionEn || project.descriptionBn
              }
              required
              className="w-full rounded-xl border border-slate-300 bg-[#e8f1f7] px-3 py-3 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <textarea
              name="impactSummary"
              rows={4}
              defaultValue={project.impactSummary ?? ""}
              className="w-full rounded-xl border border-slate-300 bg-[#e8f1f7] px-3 py-3 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
            />

            <label className="block rounded-xl border border-dashed border-slate-300 bg-[#dce8f2] p-8 text-center text-sm text-slate-600 dark:border-white/20 dark:bg-[#1d2a38] dark:text-slate-300">
              <Upload className="mx-auto mb-2 h-6 w-6" />
              Upload project media
              <input
                name="photoFiles"
                type="file"
                multiple
                accept="image/*"
                className="mt-3 w-full text-xs"
              />
            </label>
          </form>
        </section>

        <aside className="space-y-4">
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
