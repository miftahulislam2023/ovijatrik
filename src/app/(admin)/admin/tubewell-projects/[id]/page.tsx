import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  deleteTubewellProjectPermanently,
  duplicateTubewellProject,
  softDeleteTubewellProject,
  updateTubewellProject,
} from "@/actions/tubewell-project";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";
import { redirect } from "next/navigation";

export default async function EditTubewellProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    const description = String(formData.get("description") || "").trim();
    const completionDateStr = String(
      formData.get("completionDate") || "",
    ).trim();
    const impactSummary = String(formData.get("impactSummary") || "").trim();

    const completionDate = completionDateStr
      ? new Date(completionDateStr)
      : project.completionDate;

    const urls = [...project.photos];

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
      descriptionBn: description,
      descriptionEn: description,
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
    <Card>
      <CardHeader>
        <CardTitle>Edit: {project.titleEn || project.titleBn}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={updateAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="titleBn"
              defaultValue={project.titleBn}
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="titleEn"
              defaultValue={project.titleEn ?? ""}
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="slug"
              defaultValue={project.slug}
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="location"
              defaultValue={project.location}
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="completionDate"
              type="date"
              defaultValue={project.completionDate.toISOString().slice(0, 10)}
              className="rounded-md border border-input px-3 py-2"
              required
            />
          </div>
          <textarea
            name="description"
            defaultValue={project.descriptionEn || project.descriptionBn}
            rows={5}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
          <textarea
            name="impactSummary"
            defaultValue={project.impactSummary ?? ""}
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
          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="w-full sm:w-auto">
              Save Changes
            </Button>
          </div>
        </form>
        <div className="mt-4 flex flex-wrap gap-3">
          <form action={duplicateAction}>
            <Button type="submit" variant="outline">
              Duplicate
            </Button>
          </form>
          <form action={deleteAction}>
            <Button type="submit" variant="destructive">
              Archive
            </Button>
          </form>
          <form action={permanentDeleteAction}>
            <Button type="submit" variant="destructive">
              Delete Permanently
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
