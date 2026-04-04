"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/authorization";

export async function getGalleryItems() {
  return prisma.galleryItem.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getGalleryItemById(id: string) {
  return prisma.galleryItem.findUnique({
    where: { id },
  });
}

export async function createGalleryItem(data: {
  titleBn?: string;
  titleEn?: string;
  details?: string;
  imageUrl: string;
  sortOrder?: number;
}) {
  await requireAdminAction();

  const item = await prisma.galleryItem.create({
    data: {
      titleBn: data.titleBn ?? null,
      titleEn: data.titleEn ?? null,
      details: data.details ?? null,
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return item;
}

export async function updateGalleryItem(
  id: string,
  data: Partial<{
    titleBn?: string;
    titleEn?: string;
    details?: string;
    imageUrl: string;
    sortOrder: number;
  }>
) {
  await requireAdminAction();

  const item = await prisma.galleryItem.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return item;
}

export async function softDeleteGalleryItem(id: string) {
  await requireAdminAction();

  const item = await prisma.galleryItem.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return item;
}

export async function deleteGalleryItemPermanently(id: string) {
  await requireAdminAction();

  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return null;

  await prisma.galleryItem.delete({ where: { id } });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return item;
}

export async function duplicateGalleryItem(id: string) {
  await requireAdminAction();

  const original = await prisma.galleryItem.findUnique({ where: { id } });
  if (!original) return null;

  const copy = await prisma.galleryItem.create({
    data: {
      titleBn: original.titleBn ? original.titleBn + " (কপি)" : null,
      titleEn: original.titleEn ? original.titleEn + " (Copy)" : null,
      details: original.details,
      imageUrl: original.imageUrl,
      sortOrder: original.sortOrder,
    },
  });

  revalidatePath("/admin/gallery");
  return copy;
}

function getIdsFromFormData(formData: FormData) {
  return formData
    .getAll("ids")
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

export async function bulkSoftDeleteGalleryItems(formData: FormData) {
  await requireAdminAction();

  const ids = getIdsFromFormData(formData);
  if (ids.length === 0) return;

  await prisma.galleryItem.updateMany({
    where: {
      id: { in: ids },
      deletedAt: null,
    },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function bulkDeleteGalleryItemsPermanently(formData: FormData) {
  await requireAdminAction();

  const ids = getIdsFromFormData(formData);
  if (ids.length === 0) return;

  await prisma.galleryItem.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
