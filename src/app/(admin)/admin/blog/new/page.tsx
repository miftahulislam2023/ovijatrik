import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBlogPost } from "@/actions/blog";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";

export default function NewBlogPostPage() {
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
      throw new Error("Title and markdown content are required");
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
    <Card>
      <CardHeader>
        <CardTitle>Create Blog Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="titleBn"
              placeholder="Title (Bangla)"
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="titleEn"
              placeholder="Title (English)"
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="slug"
              placeholder="Slug (optional)"
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="readingTime"
              type="number"
              min={1}
              placeholder="Reading time (min)"
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="metaTitle"
              placeholder="Meta title"
              className="rounded-md border border-input px-3 py-2 md:col-span-2"
            />
          </div>
          <textarea
            name="metaDescription"
            rows={3}
            placeholder="Meta description"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <textarea
            name="markdownBn"
            rows={10}
            placeholder="Markdown (Bangla)"
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
          <textarea
            name="markdownEn"
            rows={10}
            placeholder="Markdown (English)"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <input
            name="coverFile"
            type="file"
            accept="image/*"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" /> Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" /> Featured
            </label>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Create Blog Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
