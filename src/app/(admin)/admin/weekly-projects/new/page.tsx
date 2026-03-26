import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createWeeklyProject } from "@/actions/weekly-project";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";

export default function NewWeeklyProjectPage() {
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
    <Card>
      <CardHeader>
        <CardTitle>Create Weekly Project</CardTitle>
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
              name="targetAmount"
              type="number"
              min={1}
              placeholder="Target amount"
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <select
              name="status"
              className="rounded-md border border-input px-3 py-2"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            <div className="grid gap-2 md:grid-cols-2">
              <input
                name="startDate"
                type="date"
                className="rounded-md border border-input px-3 py-2"
              />
              <input
                name="endDate"
                type="date"
                className="rounded-md border border-input px-3 py-2"
              />
            </div>
          </div>
          <textarea
            name="descriptionBn"
            placeholder="Description (Bangla)"
            rows={6}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
          <textarea
            name="descriptionEn"
            placeholder="Description (English)"
            rows={6}
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <input
            name="photoFiles"
            type="file"
            multiple
            accept="image/*"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="w-full sm:w-auto">
              Create Project
            </Button>
            <Link
              href="/admin/weekly-projects"
              className="text-sm text-primary underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
