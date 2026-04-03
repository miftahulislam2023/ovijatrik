import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MultiImageUploadField } from "@/components/admin/multi-image-upload-field";
import { createWeeklyProject } from "@/actions/weekly-project";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function NewWeeklyProjectPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "সাপ্তাহিক প্রকল্প ব্যবস্থাপনা",
        subtitle:
          "প্রভাবের গল্প লিখুন, লক্ষ্য নির্ধারণ করুন, এবং কমিউনিটির সহমর্মিতা নথিভুক্ত করুন।",
        projectIdentity: "প্রকল্প পরিচিতি",
        visualAssets: "ভিজ্যুয়াল সম্পদ",
        publishingDetails: "প্রকাশনা বিবরণ",
        save: "সাপ্তাহিক প্রকল্প সংরক্ষণ",
        preview: "প্রিভিউ",
      }
    : {
        title: "Weekly Project Management",
        subtitle:
          "Craft the narrative of impact. Define the scope, set the goals, and document the compassion shown by the community.",
        projectIdentity: "Project Identity",
        visualAssets: "Visual Assets",
        publishingDetails: "Publishing Details",
        save: "Save Weekly Project",
        preview: "Preview Narrative",
      };

  async function createAction(formData: FormData) {
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

    if (!titleBn || !descriptionBn || !targetAmount) {
      throw new Error("Title, description, and target amount are required");
    }

    const urls: string[] = [];

    const photoFiles = formData
      .getAll("photoFiles")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );

    for (const file of photoFiles) {
      const uploaded = await uploadImage(file, "ovijatrik/weekly-projects");
      urls.push(uploaded.url);
    }

    await createWeeklyProject({
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
          {copy.subtitle}
        </p>
      </header>

      <form action={createAction} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-xl bg-[#e7f3fb] p-8 ring-1 ring-[#d5e5ef] dark:bg-[#182534] dark:ring-white/10">
            <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-[#8c4e35]">
              {copy.visualAssets}
            </h2>
            <MultiImageUploadField
              name="photoFiles"
              label="Project Image Gallery"
              hint="Recommended: 1920x1080"
              dropzoneClassName="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#bec8ca] bg-white px-4 py-8 text-center transition-colors hover:border-[#00535b] dark:bg-[#0f1620]"
              previewGridClassName="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
            />
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-[#121923] dark:ring-white/10">
            <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-[#00535b]">
              {copy.projectIdentity}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {isBn ? "প্রকল্প শিরোনাম (বাংলা)" : "Project Title (Bangla)"}
                </label>
                <input
                  name="titleBn"
                  required
                  placeholder="e.g., সিলেট অঞ্চলে বিশুদ্ধ পানির উদ্যোগ"
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {isBn
                    ? "প্রকল্প শিরোনাম (ইংরেজি)"
                    : "Project Title (English)"}
                </label>
                <input
                  name="titleEn"
                  placeholder="e.g., Clean Water Initiative: Sylhet Region"
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
                      required
                      placeholder="0.00"
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
                  placeholder="Optional. Auto-generated if empty"
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
                    className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {isBn
                    ? "বিস্তারিত বিবরণ (বাংলা)"
                    : "Detailed Description (Bangla)"}
                </label>
                <textarea
                  name="descriptionBn"
                  rows={8}
                  required
                  placeholder="Narrate the story, the need, and the expected outcome..."
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {isBn
                    ? "বিস্তারিত বিবরণ (ইংরেজি)"
                    : "Detailed Description (English)"}
                </label>
                <textarea
                  name="descriptionEn"
                  rows={8}
                  placeholder="Optional English narrative"
                  className="w-full rounded-lg border-none bg-[#e7f3fb] px-4 py-3 focus:ring-2 focus:ring-[#00535b] dark:bg-[#0f1620]"
                />
              </div>
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
                  Drafting
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600 dark:text-slate-300">
                  Last Saved
                </span>
                <span className="italic text-slate-500">Not saved yet</span>
              </div>
            </div>
          </section>

          <Button
            type="submit"
            className="w-full rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] py-6 text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99]"
          >
            <Save className="h-4 w-4" />
            {copy.save}
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-2 border-[#bec8ca] py-6 text-slate-700 hover:bg-slate-50 dark:text-slate-200"
          >
            <Link href="/admin/weekly-projects">
              <Eye className="h-4 w-4" />
              {copy.preview}
            </Link>
          </Button>
        </aside>
      </form>
    </div>
  );
}
