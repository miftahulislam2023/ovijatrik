import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  duplicateBlogPost,
  softDeleteBlogPost,
  updateBlogPost,
} from "@/actions/blog";
import { uploadImage } from "@/lib/cloudinary";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slug";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    const coverImageUrl = String(formData.get("coverImageUrl") || "").trim();
    const coverFile = formData.get("coverFile");

    let coverImage = coverImageUrl || undefined;
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
    <Card>
      <CardHeader>
        <CardTitle>Edit: {post.titleEn || post.titleBn}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={updateAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="titleBn"
              defaultValue={post.titleBn}
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="titleEn"
              defaultValue={post.titleEn ?? ""}
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="slug"
              defaultValue={post.slug}
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="readingTime"
              type="number"
              min={1}
              defaultValue={post.readingTime ?? ""}
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="metaTitle"
              defaultValue={post.metaTitle ?? ""}
              className="rounded-md border border-input px-3 py-2 md:col-span-2"
            />
          </div>
          <textarea
            name="metaDescription"
            defaultValue={post.metaDescription ?? ""}
            rows={3}
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <textarea
            name="markdownBn"
            defaultValue={post.markdownBn}
            rows={10}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
          <textarea
            name="markdownEn"
            defaultValue={post.markdownEn ?? ""}
            rows={10}
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <input
            name="coverImageUrl"
            defaultValue={post.coverImage ?? ""}
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
              <input
                type="checkbox"
                name="published"
                defaultChecked={post.published}
              />{" "}
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={post.featured}
              />{" "}
              Featured
            </label>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Save Changes
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-3">
          <form action={duplicateAction}>
            <Button variant="outline" type="submit">
              Duplicate
            </Button>
          </form>
          <form action={deleteAction}>
            <Button variant="destructive" type="submit">
              Archive
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
