"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/authorization";

export async function getVolunteerApplications() {
  await requireAdminAction();

  return prisma.volunteerApplication.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVolunteerApplicationById(id: string) {
  await requireAdminAction();

  return prisma.volunteerApplication.findUnique({
    where: { id },
  });
}

export async function submitVolunteerApplication(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const address = String(formData.get("address") || "").trim() || null;
  const availability =
    String(formData.get("availability") || "").trim() || null;
  const interests = String(formData.get("interests") || "").trim() || null;
  const experience =
    String(formData.get("experience") || "").trim() || null;
  const motivation = String(formData.get("motivation") || "").trim();

  if (!name || !phone || !motivation) {
    throw new Error("Name, phone, and motivation are required");
  }

  const application = await prisma.volunteerApplication.create({
    data: {
      name,
      phone,
      email,
      address,
      availability,
      interests,
      experience,
      motivation,
      status: "PENDING",
    },
  });

  revalidatePath("/join-us");
  revalidatePath("/admin/volunteers");
  return application;
}

export async function updateVolunteerApplication(
  id: string,
  data: Partial<{
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    availability?: string | null;
    interests?: string | null;
    experience?: string | null;
    motivation: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }>,
) {
  await requireAdminAction();

  const application = await prisma.volunteerApplication.update({
    where: { id },
    data: {
      ...data,
      reviewedAt: data.status ? new Date() : undefined,
    },
  });

  revalidatePath("/admin/volunteers");
  return application;
}

export async function softDeleteVolunteerApplication(id: string) {
  await requireAdminAction();

  const application = await prisma.volunteerApplication.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/volunteers");
  return application;
}

function getIdsFromFormData(formData: FormData) {
  return formData
    .getAll("ids")
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

export async function bulkSoftDeleteVolunteerApplications(formData: FormData) {
  await requireAdminAction();

  const ids = getIdsFromFormData(formData);
  if (ids.length === 0) return;

  await prisma.volunteerApplication.updateMany({
    where: {
      id: { in: ids },
      deletedAt: null,
    },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/volunteers");
}
