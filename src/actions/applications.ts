"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/authorization";

export async function getApplications() {
  await requireAdminAction();

  return prisma.application.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplicationById(id: string) {
  await requireAdminAction();

  return prisma.application.findUnique({
    where: { id },
  });
}

// Public form submit
export async function submitApplication(formData: FormData) {
  const name = String(formData.get("name") || "");
  const phone = String(formData.get("phone") || "");
  const email = formData.get("email") ? String(formData.get("email")) : null;
  const address = formData.get("address") ? String(formData.get("address")) : null;
  const reason = String(formData.get("reason") || "");
  const details = formData.get("details") ? String(formData.get("details")) : null;

  if (!name || !phone || !reason) {
    throw new Error("Required fields missing");
  }

  const app = await prisma.application.create({
    data: {
      name,
      phone,
      email,
      address,
      reason,
      details,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/applications");
  return app;
}

// Admin update
export async function updateApplication(
  id: string,
  data: Partial<{
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    reason: string;
    details?: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }>
) {
  await requireAdminAction();

  const app = await prisma.application.update({
    where: { id },
    data: {
      ...data,
      reviewedAt: data.status ? new Date() : undefined,
    },
  });

  revalidatePath("/admin/applications");
  return app;
}

export async function softDeleteApplication(id: string) {
  await requireAdminAction();

  const app = await prisma.application.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/applications");
  return app;
}

function getIdsFromFormData(formData: FormData) {
  return formData
    .getAll("ids")
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

export async function bulkSoftDeleteApplications(formData: FormData) {
  await requireAdminAction();

  const ids = getIdsFromFormData(formData);
  if (ids.length === 0) return;

  await prisma.application.updateMany({
    where: {
      id: { in: ids },
      deletedAt: null,
    },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/applications");
}
