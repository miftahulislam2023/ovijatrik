import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  softDeleteVolunteerApplication,
  updateVolunteerApplication,
} from "@/actions/volunteers";

export default async function VolunteerApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await prisma.volunteerApplication.findFirst({
    where: { id, deletedAt: null },
  });

  if (!application) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    await updateVolunteerApplication(id, {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim() || null,
      address: String(formData.get("address") || "").trim() || null,
      availability: String(formData.get("availability") || "").trim() || null,
      interests: String(formData.get("interests") || "").trim() || null,
      experience: String(formData.get("experience") || "").trim() || null,
      motivation: String(formData.get("motivation") || "").trim(),
      status: String(formData.get("status") || "PENDING") as
        | "PENDING"
        | "APPROVED"
        | "REJECTED",
    });

    redirect("/admin/volunteers");
  }

  async function deleteAction() {
    "use server";
    await softDeleteVolunteerApplication(id);
    redirect("/admin/volunteers");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{application.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={updateAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            defaultValue={application.name}
            className="rounded-md border border-input px-3 py-2"
            required
          />
          <input
            name="phone"
            defaultValue={application.phone}
            className="rounded-md border border-input px-3 py-2"
            required
          />
          <input
            name="email"
            defaultValue={application.email ?? ""}
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="address"
            defaultValue={application.address ?? ""}
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="availability"
            defaultValue={application.availability ?? ""}
            className="rounded-md border border-input px-3 py-2"
          />
          <input
            name="interests"
            defaultValue={application.interests ?? ""}
            className="rounded-md border border-input px-3 py-2"
          />
          <select
            name="status"
            defaultValue={application.status}
            className="rounded-md border border-input px-3 py-2 md:col-span-2"
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <textarea
            name="experience"
            rows={4}
            defaultValue={application.experience ?? ""}
            className="rounded-md border border-input px-3 py-2 md:col-span-2"
          />
          <textarea
            name="motivation"
            rows={4}
            defaultValue={application.motivation}
            className="rounded-md border border-input px-3 py-2 md:col-span-2"
            required
          />
          <Button type="submit" className="w-full md:col-span-2 md:w-fit">
            Save Changes
          </Button>
        </form>

        <form action={deleteAction}>
          <Button type="submit" variant="destructive">
            Archive Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
