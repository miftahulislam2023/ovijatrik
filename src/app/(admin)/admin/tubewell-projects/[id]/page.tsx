import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { MultiImageUploadField } from "@/components/admin/multi-image-upload-field";
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
import Image from "next/image";
import { ArrowLeft, Droplets, MapPin, Save } from "lucide-react";
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
        title: "টিউবওয়েল প্রকল্প সম্পাদনা",
        subtitle: "প্রকাশনার আগে লোকেশন, বিবরণ ও ছবির গ্যালারি আপডেট করুন।",
        breadcrumb: "প্রকল্প / টিউবওয়েল / সম্পাদনা",
        coreInfo: "মূল তথ্য",
        impact: "কমিউনিটি ইমপ্যাক্ট",
        media: "প্রকল্প মিডিয়া",
        save: "পরিবর্তন সংরক্ষণ",
        cancel: "বাতিল",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        delete: "স্থায়ীভাবে মুছুন",
      }
    : {
        title: "Edit Tubewell Project",
        subtitle: "Update location, narratives, and media before publishing.",
        breadcrumb: "Projects / Tubewells / Edit",
        coreInfo: "Core Information",
        impact: "Community Impact",
        media: "Project Media",
        save: "Save Changes",
        cancel: "Cancel",
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
    const descriptionBn = String(formData.get("descriptionBn") || "").trim();
    const descriptionEn = String(formData.get("descriptionEn") || "").trim();
    const completionDateStr = String(
      formData.get("completionDate") || "",
    ).trim();
    const impactSummary = String(formData.get("impactSummary") || "").trim();
    const removedPhotos = new Set(
      formData
        .getAll("removeExistingPhotos")
        .map((value) => String(value || "").trim())
        .filter(Boolean),
    );

    const completionDate = completionDateStr
      ? new Date(completionDateStr)
      : project.completionDate;

    const urls = project.photos.filter((photo) => !removedPhotos.has(photo));

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
      descriptionBn,
      descriptionEn: descriptionEn || undefined,
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
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <header className="rounded-3xl border border-[#d4e6ef] bg-linear-to-br from-[#f4faff] via-[#edf7ff] to-[#e7f3fb] p-6 shadow-sm dark:border-white/10 dark:from-[#12212d] dark:via-[#0f1b25] dark:to-[#0d1720] md:p-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
          <span>{copy.breadcrumb}</span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/admin/tubewell-projects"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#bed4de] bg-white text-[#00535b] transition-colors hover:bg-[#e7f6ff] dark:border-white/15 dark:bg-[#101b26]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                {copy.title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
                {copy.subtitle}
              </p>
            </div>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-full border-[#bec8ca] bg-white text-[#00535b] hover:bg-[#e7f6ff] sm:flex-none dark:border-white/20 dark:bg-[#111d27]"
            >
              <Link href="/admin/tubewell-projects">{copy.cancel}</Link>
            </Button>
            <Button
              type="submit"
              form="tubewell-edit-form"
              className="flex-1 rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99] sm:flex-none"
            >
              <Save className="h-4 w-4" />
              {copy.save}
            </Button>
          </div>
        </div>
      </header>

      <form
        id="tubewell-edit-form"
        action={updateAction}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d5e5ef] dark:bg-[#121923] dark:ring-white/10 md:p-8">
            <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-[#006972]">
              <Droplets className="h-5 w-5" />
              {copy.coreInfo}
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}
                </label>
                <input
                  name="titleBn"
                  required
                  defaultValue={project.titleBn}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}
                </label>
                <input
                  name="titleEn"
                  defaultValue={project.titleEn ?? ""}
                  placeholder={isBn ? "ঐচ্ছিক" : "Optional"}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Slug
                </label>
                <input
                  name="slug"
                  defaultValue={project.slug}
                  required
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isBn ? "সমাপ্তির তারিখ" : "Completion Date"}
                </label>
                <input
                  name="completionDate"
                  type="date"
                  required
                  defaultValue={project.completionDate
                    .toISOString()
                    .slice(0, 10)}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isBn ? "লোকেশন" : "Village / Location"}
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#006972]" />
                  <input
                    name="location"
                    required
                    defaultValue={project.location}
                    className="w-full rounded-lg border-none bg-[#e7f6ff] py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d5e5ef] dark:bg-[#121923] dark:ring-white/10 md:p-8">
            <h2 className="mb-6 font-serif text-2xl font-bold text-[#006972]">
              {copy.impact}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isBn
                    ? "বিস্তারিত বিবরণ (বাংলা)"
                    : "Narrative Description (Bangla)"}
                </label>
                <textarea
                  name="descriptionBn"
                  rows={6}
                  required
                  defaultValue={project.descriptionBn}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 leading-relaxed focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isBn
                    ? "বিস্তারিত বিবরণ (ইংরেজি)"
                    : "Narrative Description (English)"}
                </label>
                <textarea
                  name="descriptionEn"
                  rows={6}
                  defaultValue={project.descriptionEn ?? ""}
                  placeholder={
                    isBn ? "ঐচ্ছিক ইংরেজি বিবরণ" : "Optional English narrative"
                  }
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 leading-relaxed focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isBn ? "প্রভাব সারাংশ" : "Impact Summary"}
                </label>
                <textarea
                  name="impactSummary"
                  rows={4}
                  defaultValue={project.impactSummary ?? ""}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 leading-relaxed focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-[#e7f6ff] p-5 ring-1 ring-[#d5e5ef] dark:bg-[#162230] dark:ring-white/10">
            <h3 className="mb-3 text-xl font-bold text-[#006972]">
              {copy.media}
            </h3>
            <MultiImageUploadField
              name="photoFiles"
              label={isBn ? "নতুন ছবি আপলোড" : "Upload New Images"}
              hint={
                isBn
                  ? "নির্বাচিত ছবি বিদ্যমান গ্যালারির সাথে যুক্ত হবে"
                  : "Selected images will be added to the existing gallery"
              }
              dropzoneClassName="group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bec8ca] bg-white px-4 py-8 text-center transition-colors hover:border-[#006d77] hover:bg-[#f4faff] dark:bg-[#0f1620]"
              previewGridClassName="mt-4 grid grid-cols-2 gap-3"
            />

            {project.photos.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {isBn ? "বর্তমান গ্যালারি" : "Existing Gallery"} (
                  {project.photos.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {project.photos.map((photo, index) => (
                    <label
                      key={`${photo}-${index}`}
                      className="relative block cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0f1620]">
                        <Image
                          src={photo}
                          alt={`Existing tubewell image ${index + 1}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 20vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="pointer-events-none absolute inset-x-2 bottom-2 rounded-md bg-black/60 px-2 py-1 text-center text-[11px] font-semibold text-white">
                        {isBn ? "রিমুভ করতে টিক দিন" : "Check to remove"}
                      </span>
                      <input
                        type="checkbox"
                        name="removeExistingPhotos"
                        value={photo}
                        className="absolute right-2 top-2 h-5 w-5 rounded border-white/60 bg-white/90 text-red-600"
                        aria-label={`Remove existing image ${index + 1}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#d5e5ef] bg-white p-5 text-sm dark:border-white/10 dark:bg-[#121923]">
            <p className="font-semibold uppercase tracking-[0.12em] text-slate-500">
              {isBn ? "প্রকাশনা অবস্থা" : "Publishing Status"}
            </p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f4faff] px-4 py-3 dark:bg-[#0f1620]">
              <span className="text-slate-600 dark:text-slate-300">
                {isBn ? "আপডেট" : "Last Updated"}
              </span>
              <span className="text-xs font-semibold text-[#793f27]">
                {project.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </section>

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
      </form>
    </div>
  );
}
