import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createTubewellProject } from "@/actions/tubewell-project";
import { slugify } from "@/lib/slug";
import { uploadImage } from "@/lib/cloudinary";

export default function NewTubewellProjectPage() {
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
    <Card>
      <CardHeader>
        <CardTitle>Create Tubewell Project</CardTitle>
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
              name="location"
              placeholder="Location"
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="completionDate"
              type="date"
              className="rounded-md border border-input px-3 py-2"
              required
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            rows={5}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
          <textarea
            name="impactSummary"
            placeholder="Impact summary"
            rows={4}
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
              href="/admin/tubewell-projects"
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
