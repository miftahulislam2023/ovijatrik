import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createTubewellProject } from "@/actions/tubewell-project";
import { slugify } from "@/lib/slug";
import { uploadImage } from "@/lib/cloudinary";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function NewTubewellProjectPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "নতুন টিউবওয়েল প্রকল্প",
        subtitle: "প্রকাশনার জন্য লোকেশন ও প্রভাব তথ্য ডকুমেন্ট করুন।",
        coreInfo: "মূল তথ্য",
        save: "প্রকল্প সংরক্ষণ",
        cancel: "বাতিল",
      }
    : {
        title: "Create Tubewell Project",
        subtitle:
          "Document core location and community impact for publication.",
        coreInfo: "Core Information",
        save: "Save Project",
        cancel: "Cancel",
      };

  async function createAction(formData: FormData) {
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

    if (!titleBn || !location || !description || !completionDateStr) {
      throw new Error("Required fields missing");
    }

    const completionDate = new Date(completionDateStr);
    const urls: string[] = [];

    const photoFiles = formData
      .getAll("photoFiles")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );
    for (const file of photoFiles) {
      const uploaded = await uploadImage(file, "ovijatrik/tubewell-projects");
      urls.push(uploaded.url);
    }

    await createTubewellProject({
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
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              {copy.title}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              {copy.subtitle}
            </p>
          </div>
        </div>
      </header>

      <form
        action={createAction}
        className="grid gap-6 lg:grid-cols-[1fr_260px]"
      >
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121923]">
          <h2 className="text-2xl font-semibold text-[#0f5f79]">
            {copy.coreInfo}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="titleBn"
              placeholder={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}
              required
              className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <input
              name="titleEn"
              placeholder={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}
              className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <input
              name="slug"
              placeholder="Slug (optional)"
              className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 dark:border-white/10 dark:bg-[#0f1620]"
            />
            <input
              name="location"
              placeholder={isBn ? "লোকেশন" : "Location"}
              required
              className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <input
              name="completionDate"
              type="date"
              required
              className="rounded-lg border border-slate-300 bg-[#e8f1f7] px-3 py-2.5 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
            />
          </div>

          <textarea
            name="description"
            rows={6}
            required
            placeholder={isBn ? "বিস্তারিত বিবরণ" : "Narrative description"}
            className="w-full rounded-xl border border-slate-300 bg-[#e8f1f7] px-3 py-3 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <textarea
            name="impactSummary"
            rows={4}
            placeholder={isBn ? "প্রভাব সারাংশ" : "Impact summary"}
            className="w-full rounded-xl border border-slate-300 bg-[#e8f1f7] px-3 py-3 text-slate-900 dark:border-white/10 dark:bg-[#0f1620] dark:text-slate-100"
          />

          <label className="block rounded-xl border border-dashed border-slate-300 bg-[#dce8f2] p-8 text-center text-sm text-slate-600 dark:border-white/20 dark:bg-[#1d2a38] dark:text-slate-300">
            <Upload className="mx-auto mb-2 h-6 w-6" />
            Project media uploads
            <input
              name="photoFiles"
              type="file"
              multiple
              accept="image/*"
              className="mt-3 w-full text-xs"
            />
          </label>
        </div>

        <aside className="space-y-4">
          <Button
            type="submit"
            className="w-full rounded-full bg-[#0b6979] py-6 text-white hover:bg-[#095968]"
          >
            <Save className="h-4 w-4" />
            {copy.save}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/tubewell-projects">{copy.cancel}</Link>
          </Button>
        </aside>
      </form>
    </div>
  );
}
