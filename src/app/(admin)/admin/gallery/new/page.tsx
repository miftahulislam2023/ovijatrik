import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MultiImageUploadField } from "@/components/admin/multi-image-upload-field";
import { createGalleryItem } from "@/actions/gallery";
import { uploadImage } from "@/lib/cloudinary";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function NewGalleryItemPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "নতুন গ্যালারি এন্ট্রি",
        subtitle: "একাধিক ছবি আপলোড করুন এবং দ্রুত পাবলিক গ্যালারি আপডেট করুন।",
        media: "ইমেজ আপলোড",
        details: "এন্ট্রি বিবরণ",
        titleBn: "শিরোনাম (বাংলা)",
        titleEn: "শিরোনাম (ইংরেজি)",
        detailsField: "বিস্তারিত",
        sortOrder: "সাজানোর ক্রম (0 = প্রথম)",
        uploadHint: "JPG, PNG, WEBP • একাধিক ছবি নির্বাচন করতে পারবেন",
        save: "গ্যালারি এন্ট্রি সংরক্ষণ",
        cancel: "বাতিল",
        preview: "গ্যালারি দেখুন",
        status: "প্রকাশনা অবস্থা",
        drafting: "খসড়া",
      }
    : {
        title: "Create Gallery Entry",
        subtitle: "Upload multiple images and update your public gallery fast.",
        media: "Image Upload",
        details: "Entry Details",
        titleBn: "Title (Bangla)",
        titleEn: "Title (English)",
        detailsField: "Details",
        sortOrder: "Sort order (0 = first)",
        uploadHint: "JPG, PNG, WEBP • You can select multiple images",
        save: "Save Gallery Entries",
        cancel: "Cancel",
        preview: "View Gallery",
        status: "Publishing Status",
        drafting: "Drafting",
      };

  async function createAction(formData: FormData) {
    "use server";
    const titleBn = String(formData.get("titleBn") || "").trim();
    const titleEn = String(formData.get("titleEn") || "").trim();
    const details = String(formData.get("details") || "").trim();
    const sortOrder = Number(formData.get("sortOrder") || 0);
    const imageFiles = formData
      .getAll("imageFiles")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );

    if (!imageFiles.length) {
      throw new Error("Please upload at least one image file");
    }

    for (const [index, imageFile] of imageFiles.entries()) {
      const uploaded = await uploadImage(imageFile, "ovijatrik/gallery");

      await createGalleryItem({
        titleBn: titleBn || undefined,
        titleEn: titleEn || undefined,
        details: details || undefined,
        imageUrl: uploaded.url,
        sortOrder: sortOrder + index,
      });
    }

    redirect("/admin/gallery");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <header className="rounded-3xl border border-[#d4e6ef] bg-linear-to-br from-[#f4faff] via-[#edf7ff] to-[#e7f3fb] p-6 shadow-sm dark:border-white/10 dark:from-[#12212d] dark:via-[#0f1b25] dark:to-[#0d1720] md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/admin/gallery"
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
              <Link href="/admin/gallery">{copy.cancel}</Link>
            </Button>
            <Button
              type="submit"
              form="new-gallery-form"
              className="flex-1 rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99] sm:flex-none"
            >
              <Save className="h-4 w-4" />
              {copy.save}
            </Button>
          </div>
        </div>
      </header>

      <form
        id="new-gallery-form"
        action={createAction}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d5e5ef] dark:bg-[#121923] dark:ring-white/10 md:p-8">
            <h2 className="mb-6 font-serif text-2xl font-bold text-[#006972]">
              {copy.media}
            </h2>
            <MultiImageUploadField
              name="imageFiles"
              label={isBn ? "গ্যালারি ছবি" : "Gallery Images"}
              hint={copy.uploadHint}
              required
              maxFiles={20}
              dropzoneClassName="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bec8ca] bg-[#f4faff] px-4 py-8 text-center transition-colors hover:border-[#006d77] hover:bg-[#e7f6ff] dark:bg-[#0f1620]"
              previewGridClassName="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
            />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#d5e5ef] dark:bg-[#121923] dark:ring-white/10 md:p-8">
            <h2 className="mb-6 font-serif text-2xl font-bold text-[#006972]">
              {copy.details}
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {copy.titleBn}
                </label>
                <input
                  name="titleBn"
                  placeholder={isBn ? "ঐচ্ছিক" : "Optional"}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {copy.titleEn}
                </label>
                <input
                  name="titleEn"
                  placeholder={isBn ? "ঐচ্ছিক" : "Optional"}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {copy.sortOrder}
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={0}
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {copy.detailsField}
                </label>
                <textarea
                  name="details"
                  rows={4}
                  placeholder={
                    isBn
                      ? "এই গ্যালারি এন্ট্রির বিবরণ লিখুন"
                      : "Write details for this gallery entry"
                  }
                  className="w-full rounded-lg border-none bg-[#e7f6ff] px-4 py-3 leading-relaxed focus:ring-2 focus:ring-[#006d77]/25 dark:bg-[#0f1620]"
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#d5e5ef] bg-white p-5 text-sm dark:border-white/10 dark:bg-[#121923]">
            <p className="font-semibold uppercase tracking-[0.12em] text-slate-500">
              {copy.status}
            </p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f4faff] px-4 py-3 dark:bg-[#0f1620]">
              <span className="text-slate-600 dark:text-slate-300">Status</span>
              <span className="rounded-full bg-[#ffad8f] px-3 py-1 text-xs font-semibold text-[#793f27]">
                {copy.drafting}
              </span>
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
            <Link href="/admin/gallery">
              <Eye className="h-4 w-4" />
              {copy.preview}
            </Link>
          </Button>
        </aside>
      </form>
    </div>
  );
}
