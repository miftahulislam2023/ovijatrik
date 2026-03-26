import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  addWeeklyDonation,
  deleteWeeklyProjectPermanently,
  duplicateWeeklyProject,
  softDeleteWeeklyDonation,
  softDeleteWeeklyProject,
  updateWeeklyProject,
} from "@/actions/weekly-project";
import { uploadImage } from "@/lib/cloudinary";
import { slugify } from "@/lib/slug";
import { redirect } from "next/navigation";

export default async function EditWeeklyProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.weeklyProject.findFirst({
    where: { id, deletedAt: null },
    include: {
      donations: {
        where: { deletedAt: null },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  async function updateAction(formData: FormData) {
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

    const urls = [...project.photos];

    const photoFiles = formData
      .getAll("photoFiles")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );
    for (const file of photoFiles) {
      const uploaded = await uploadImage(file, "ovijatrik/weekly-projects");
      urls.push(uploaded.url);
    }

    await updateWeeklyProject(id, {
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

  async function deleteAction() {
    "use server";
    await softDeleteWeeklyProject(id);
    redirect("/admin/weekly-projects");
  }

  async function permanentDeleteAction() {
    "use server";
    await deleteWeeklyProjectPermanently(id);
    redirect("/admin/weekly-projects");
  }

  async function duplicateAction() {
    "use server";
    await duplicateWeeklyProject(id);
    redirect("/admin/weekly-projects");
  }

  async function addDonationAction(formData: FormData) {
    "use server";
    await addWeeklyDonation({
      projectId: id,
      medium: String(formData.get("medium") || "OTHER") as
        | "BKASH"
        | "NAGAD"
        | "ROCKET"
        | "BANK"
        | "OTHER",
      amount: Number(formData.get("amount") || 0),
      trxid: String(formData.get("trxid") || "") || undefined,
      comments: String(formData.get("comments") || "") || undefined,
      donorName: String(formData.get("donorName") || "") || undefined,
      phone: String(formData.get("phone") || "") || undefined,
    });
    redirect(`/admin/weekly-projects/${id}`);
  }

  return (
    <div className="space-y-6">
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
                name="targetAmount"
                type="number"
                min={1}
                defaultValue={project.targetAmount}
                className="rounded-md border border-input px-3 py-2"
                required
              />
              <select
                name="status"
                defaultValue={project.status}
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
                  defaultValue={
                    project.startDate
                      ? project.startDate.toISOString().slice(0, 10)
                      : ""
                  }
                  className="rounded-md border border-input px-3 py-2"
                />
                <input
                  name="endDate"
                  type="date"
                  defaultValue={
                    project.endDate
                      ? project.endDate.toISOString().slice(0, 10)
                      : ""
                  }
                  className="rounded-md border border-input px-3 py-2"
                />
              </div>
            </div>
            <textarea
              name="descriptionBn"
              defaultValue={project.descriptionBn}
              rows={6}
              className="w-full rounded-md border border-input px-3 py-2"
              required
            />
            <textarea
              name="descriptionEn"
              defaultValue={project.descriptionEn ?? ""}
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
            <div className="flex flex-wrap gap-3">
              <Button type="submit">Save Changes</Button>
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

      <Card>
        <CardHeader>
          <CardTitle>Add Donation Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={addDonationAction}
            className="grid gap-3 md:grid-cols-2"
          >
            <select
              name="medium"
              className="rounded-md border border-input px-3 py-2"
            >
              <option value="BKASH">BKASH</option>
              <option value="NAGAD">NAGAD</option>
              <option value="ROCKET">ROCKET</option>
              <option value="BANK">BANK</option>
              <option value="OTHER">OTHER</option>
            </select>
            <input
              name="amount"
              type="number"
              min={1}
              placeholder="Amount"
              className="rounded-md border border-input px-3 py-2"
              required
            />
            <input
              name="donorName"
              placeholder="Donor name"
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="phone"
              placeholder="Phone"
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="trxid"
              placeholder="TRX ID"
              className="rounded-md border border-input px-3 py-2"
            />
            <input
              name="comments"
              placeholder="Comments"
              className="rounded-md border border-input px-3 py-2"
            />
            <Button type="submit" className="w-full md:col-span-2 md:w-fit">
              Add Donation
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-sm">
            {project.donations.map((donation) => (
              <div
                key={donation.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
              >
                <p>
                  {donation.amount} BDT - {donation.medium} -{" "}
                  {donation.donorName || "Anonymous"}
                </p>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/admin/weekly-projects/${id}/donations/${donation.id}`}
                    >
                      Edit
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await softDeleteWeeklyDonation(donation.id);
                    }}
                  >
                    <Button type="submit" size="sm" variant="destructive">
                      Archive
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
