import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  duplicateBlogPost,
  softDeleteBlogPost,
  updateBlogPost,
} from "@/actions/blog";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";
import { TinyMCEField } from "@/components/admin/blog/tiny-mce-field";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "আর্টিকেল সম্পাদনা",
        editing: "সম্পাদনা:",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        save: "পরিবর্তন সংরক্ষণ",
        replaceHero: "হিরো ছবি পরিবর্তন",
        postSettings: "পোস্ট সেটিংস",
        published: "প্রকাশিত",
        featured: "হোমপেজে ফিচার্ড",
        searchPreview: "সার্চ প্রিভিউ",
      }
    : {
        title: "Drafting Article",
        editing: "Editing:",
        duplicate: "Duplicate",
        archive: "Archive",
        save: "Save Changes",
        replaceHero: "Replace Hero Image",
        postSettings: "Post Settings",
        published: "Published",
        featured: "Featured on homepage",
        searchPreview: "Search Preview",
      };

  const { id } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
  });

  if (!post) {
    notFound();
  }

  async function updateAction(formData: FormData) {
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

    let coverImage = post.coverImage || undefined;
    if (coverFile instanceof File && coverFile.size > 0) {
      const uploaded = await uploadImage(coverFile, "ovijatrik/blog");
      coverImage = uploaded.url;
    }

    await updateBlogPost(id, {
      titleBn,
      titleEn: titleEn || undefined,
      slug: slugify(slugInput || titleEn || titleBn),
      markdownBn,
      markdownEn: markdownEn || undefined,
      published,
      featured,
      readingTime: readingTimeRaw ? Number(readingTimeRaw) : undefined,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      coverImage,
    });

    redirect("/admin/blog");
  }

  async function duplicateAction() {
    "use server";
    await duplicateBlogPost(id);
    redirect("/admin/blog");
  }

  async function deleteAction() {
    "use server";
    await softDeleteBlogPost(id);
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
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {copy.editing}{" "}
              {isBn
                ? post.titleBn || post.titleEn
                : post.titleEn || post.titleBn}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <form action={duplicateAction}>
            <Button variant="outline" type="submit">
              {copy.duplicate}
            </Button>
          </form>
          <form action={deleteAction}>
            <Button variant="destructive" type="submit">
              {copy.archive}
            </Button>
          </form>
          <Button
            type="submit"
            form="blog-edit-form"
            className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
          >
            {copy.save}
          </Button>
        </div>
      </header>

      <form
        id="blog-edit-form"
        action={updateAction}
        className="grid gap-6 lg:grid-cols-[1fr_290px]"
      >
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 dark:border-white/10 dark:bg-[#121d29]">
          <label className="block rounded-xl border border-dashed border-slate-300 bg-[#dce8f2] p-10 text-center text-slate-600 dark:border-white/20 dark:bg-[#1d2a38] dark:text-slate-300">
            <Upload className="mx-auto mb-3 h-8 w-8" />
            <p className="font-medium">{copy.replaceHero}</p>
            <p className="text-xs">Recommended 2000 x 850</p>
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
              defaultValue={post.titleBn}
              placeholder="Title (Bangla)"
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-white/15 dark:bg-[#0f1620]"
            />
            <input
              name="titleEn"
              defaultValue={post.titleEn ?? ""}
              placeholder="Title (English)"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-white/15 dark:bg-[#0f1620]"
            />
            <input
              name="slug"
              defaultValue={post.slug}
              placeholder="Slug"
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-white/15 dark:bg-[#0f1620]"
            />
            <input
              name="readingTime"
              type="number"
              min={1}
              defaultValue={post.readingTime ?? ""}
              placeholder="Reading time (min)"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-white/15 dark:bg-[#0f1620]"
            />
            <input
              name="metaTitle"
              defaultValue={post.metaTitle ?? ""}
              placeholder="Meta title"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620]"
            />
            <textarea
              name="metaDescription"
              defaultValue={post.metaDescription ?? ""}
              rows={3}
              placeholder="Meta description"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620]"
            />
          </div>

          <TinyMCEField
            name="markdownBn"
            label="Content (Bangla)"
            initialValue={post.markdownBn}
            placeholder="Write Bangla content here..."
          />
          <TinyMCEField
            name="markdownEn"
            label="Content (English)"
            initialValue={post.markdownEn ?? ""}
            placeholder="Write English content here..."
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#121923]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {copy.postSettings}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={post.published}
                  className="h-4 w-4"
                />
                {copy.published}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={post.featured}
                  className="h-4 w-4"
                />
                {copy.featured}
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#deebf4] p-4 dark:border-white/10 dark:bg-[#182534]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {copy.searchPreview}
            </p>
            <p className="mt-3 line-clamp-2 text-sm font-semibold text-[#123e6c]">
              {post.metaTitle ||
                (isBn
                  ? post.titleBn || post.titleEn
                  : post.titleEn || post.titleBn)}
            </p>
            <p className="mt-1 line-clamp-3 text-xs text-slate-500">
              {post.metaDescription ||
                "Set a clean meta description for better discoverability."}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
