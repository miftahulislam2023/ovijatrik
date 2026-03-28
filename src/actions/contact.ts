"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/authorization";

export async function getMessages() {
  await requireAdminAction();

  return prisma.message.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMessageById(id: string) {
  await requireAdminAction();

  return prisma.message.findUnique({
    where: { id },
  });
}

// Public contact form submit
export async function sendContactMessage(formData: FormData) {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const phone = formData.get("phone") ? String(formData.get("phone")) : null;
  const subject = formData.get("subject") ? String(formData.get("subject")) : null;
  const body = String(formData.get("body") || "");

  if (!name || !email || !body) {
    throw new Error("Required fields missing");
  }

  const msg = await prisma.message.create({
    data: {
      name,
      email,
      phone,
      subject,
      body,
    },
  });

  revalidatePath("/admin/messages");
  return msg;
}

// Admin mark as read
export async function markMessageAsRead(id: string) {
  await requireAdminAction();

  const msg = await prisma.message.update({
    where: { id },
    data: { readAt: new Date() },
  });

  revalidatePath("/admin/messages");
  return msg;
}

export async function softDeleteMessage(id: string) {
  await requireAdminAction();

  const msg = await prisma.message.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/messages");
  return msg;
}

function getIdsFromFormData(formData: FormData) {
  return formData
    .getAll("ids")
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

export async function bulkMarkMessagesAsRead(formData: FormData) {
  await requireAdminAction();

  const ids = getIdsFromFormData(formData);
  if (ids.length === 0) return;

  await prisma.message.updateMany({
    where: {
      id: { in: ids },
      deletedAt: null,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  revalidatePath("/admin/messages");
}

export async function bulkSoftDeleteMessages(formData: FormData) {
  await requireAdminAction();

  const ids = getIdsFromFormData(formData);
  if (ids.length === 0) return;

  await prisma.message.updateMany({
    where: {
      id: { in: ids },
      deletedAt: null,
    },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/messages");
}
