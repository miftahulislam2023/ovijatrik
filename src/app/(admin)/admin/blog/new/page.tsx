import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBlogPost } from "@/actions/blog";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { TinyMCEField } from "@/components/admin/blog/tiny-mce-field";
import { getRequestLanguage } from "@/lib/language";

export default async function NewBlogPostPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "নতুন আর্টিকেল খসড়া",
        unsaved: "অসংরক্ষিত পরিবর্তন",
        saveDraft: "খসড়া সংরক্ষণ",
        publish: "আর্টিকেল প্রকাশ করুন",
        uploadHero: "হিরো ছবি আপলোড করুন",
        recommended: "প্রস্তাবিত 2000 x 850",
        titleBn: "শিরোনাম (বাংলা)",
        titleEn: "শিরোনাম (ইংরেজি)",
        slug: "স্লাগ (ঐচ্ছিক)",
        readingTime: "পড়ার সময় (মিনিট)",
        metaTitle: "মেটা টাইটেল",
        metaDescription: "মেটা বিবরণ",
        contentBn: "কনটেন্ট (বাংলা)",
        contentEn: "কনটেন্ট (ইংরেজি)",
        postSettings: "পোস্ট সেটিংস",
        published: "প্রকাশিত",
        featured: "হোমপেজে ফিচার্ড",
        searchPreview: "সার্চ প্রিভিউ",
      }
    : {
        title: "Drafting Article",
        unsaved: "Unsaved changes",
        saveDraft: "Save Draft",
        publish: "Publish Article",
        uploadHero: "Upload Hero Image",
        recommended: "Recommended 2000 x 850",
        titleBn: "Title (Bangla)",
        titleEn: "Title (English)",
        slug: "Slug (optional)",
        readingTime: "Reading time (min)",
        metaTitle: "Meta title",
        metaDescription: "Meta description",
        contentBn: "Content (Bangla)",
        contentEn: "Content (English)",
        postSettings: "Post Settings",
        published: "Published",
        featured: "Featured on homepage",
        searchPreview: "Search Preview",
      };

  async function createAction(formData: FormData) {
    "use server";

    const titleBn = String(formData.get("titleBn") || "").trim();
    const titleEn = String(formData.get("titleEn") || "").trim();
    const slugInput = String(formData.get("slug") || "").trim();
    const markdownBn = String(formData.get("markdownBn") || "").trim();
    const markdownEn = String(formData.get("markdownEn") || "").trim();
    const published = formData.get("published") === "on";
    const featured = formData.get("featured") === "on";
    const readingTimeRaw = String(formData.get("readingTime") || "").trim();
    const metaTitle = String(formData.get("metaTitle") || "").trim();
    const metaDescription = String(
      formData.get("metaDescription") || "",
    ).trim();
    const coverFile = formData.get("coverFile");

    if (!titleBn || !markdownBn) {
      throw new Error("Title and content are required");
    }

    let coverImage: string | undefined;
    if (coverFile instanceof File && coverFile.size > 0) {
      const uploaded = await uploadImage(coverFile, "ovijatrik/blog");
      coverImage = uploaded.url;
    }

    await createBlogPost({
      titleBn,
      titleEn: titleEn || undefined,
      slug: slugify(slugInput || titleEn || titleBn),
      markdownBn,
      markdownEn: markdownEn || undefined,
      coverImage,
      published,
      featured,
      readingTime: readingTimeRaw ? Number(readingTimeRaw) : undefined,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
    });

    redirect("/admin/blog");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121923]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {copy.title}
            </h1>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {copy.unsaved}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">{copy.saveDraft}</Button>
          <Button
            type="submit"
            form="blog-create-form"
            className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
          >
            {copy.publish}
          </Button>
        </div>
      </header>

      <form
        id="blog-create-form"
        action={createAction}
        className="grid gap-6 lg:grid-cols-[1fr_290px]"
      >
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 dark:border-white/10 dark:bg-[#121d29]">
          <label className="block rounded-xl border border-dashed border-slate-300 bg-[#dce8f2] p-10 text-center text-slate-600 dark:border-white/20 dark:bg-[#1d2a38] dark:text-slate-300">
            <Upload className="mx-auto mb-3 h-8 w-8" />
            <p className="font-medium">{copy.uploadHero}</p>
            <p className="text-xs">{copy.recommended}</p>
            <input
              name="coverFile"
              type="file"
              accept="image/*"
              className="mt-4 w-full text-xs"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="titleBn"
              placeholder={copy.titleBn}
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <input
              name="titleEn"
              placeholder={copy.titleEn}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <input
              name="slug"
              placeholder={copy.slug}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <input
              name="readingTime"
              type="number"
              min={1}
              placeholder={copy.readingTime}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <input
              name="metaTitle"
              placeholder={copy.metaTitle}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            />
            <textarea
              name="metaDescription"
              rows={3}
              placeholder={copy.metaDescription}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
            />
          </div>

          <TinyMCEField
            name="markdownBn"
            label={copy.contentBn}
            placeholder="Write Bangla content here..."
          />
          <TinyMCEField
            name="markdownEn"
            label={copy.contentEn}
            placeholder="Write English content here..."
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#121923]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.postSettings}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="published" className="h-4 w-4" />
                {copy.published}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="featured" className="h-4 w-4" />
                {copy.featured}
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#deebf4] p-4 dark:border-white/10 dark:bg-[#182534]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.searchPreview}
            </p>
            <p className="mt-3 text-sm font-semibold text-[#123e6c]">
              Your article preview will appear here.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Set a clean meta title and description for better discoverability.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
