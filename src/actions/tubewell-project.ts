"use server";

import {prisma }from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/authorization";

export async function getTubewellProjects() {
  return prisma.tubewellProject.findMany({
    where: { deletedAt: null },
    orderBy: { completionDate: "desc" },
  });
}

export async function getTubewellProjectBySlug(slug: string) {
  return prisma.tubewellProject.findUnique({
    where: { slug },
  });
}

export async function getTubewellProjectById(id: string) {
  return prisma.tubewellProject.findUnique({
    where: { id },
  });
}

export async function createTubewellProject(data: {
  titleBn: string;
  titleEn?: string;
  slug: string;
  location: string;
  descriptionBn: string;
  descriptionEn?: string;
  photos?: string[];
  completionDate: Date;
  year: number;
  impactSummary?: string;
}) {
  await requireAdminAction();

  const project = await prisma.tubewellProject.create({
    data: {
      titleBn: data.titleBn,
      titleEn: data.titleEn,
      slug: data.slug,
      location: data.location,
      descriptionBn: data.descriptionBn,
      descriptionEn: data.descriptionEn,
      photos: data.photos ?? [],
      completionDate: data.completionDate,
      year: data.year,
      impactSummary: data.impactSummary,
    },
  });

  revalidatePath("/admin/tubewell-projects");
  revalidatePath("/tubewell-projects");
  return project;
}

export async function updateTubewellProject(
  id: string,
  data: Partial<{
    titleBn: string;
    titleEn?: string;
    slug: string;
    location: string;
    descriptionBn: string;
    descriptionEn?: string;
    photos: string[];
    completionDate: Date;
    year: number;
    impactSummary?: string;
  }>
) {
  await requireAdminAction();

  const project = await prisma.tubewellProject.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/tubewell-projects");
  revalidatePath("/tubewell-projects");
  if (data.slug) revalidatePath(`/tubewell-projects/${data.slug}`);
  return project;
}

export async function softDeleteTubewellProject(id: string) {
  await requireAdminAction();

  const project = await prisma.tubewellProject.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/tubewell-projects");
  revalidatePath(`/admin/tubewell-projects/${id}`);
  revalidatePath("/tubewell-projects");
  revalidatePath(`/tubewell-projects/${project.slug}`);
  return project;
}

export async function deleteTubewellProjectPermanently(id: string) {
  await requireAdminAction();

  const project = await prisma.tubewellProject.findUnique({ where: { id } });
  if (!project) return null;

  await prisma.tubewellProject.delete({
    where: { id },
  });

  revalidatePath("/admin/tubewell-projects");
  revalidatePath(`/admin/tubewell-projects/${id}`);
  revalidatePath("/tubewell-projects");
  revalidatePath(`/tubewell-projects/${project.slug}`);
  return project;
}

export async function duplicateTubewellProject(id: string) {
  await requireAdminAction();

  const original = await prisma.tubewellProject.findUnique({ where: { id } });
  if (!original) return null;

  const copy = await prisma.tubewellProject.create({
    data: {
      titleBn: original.titleBn + " (কপি)",
      titleEn: original.titleEn ? original.titleEn + " (Copy)" : null,
      slug: original.slug + "-copy-" + Date.now().toString().slice(-4),
      location: original.location,
      descriptionBn: original.descriptionBn,
      descriptionEn: original.descriptionEn,
      photos: original.photos,
      completionDate: original.completionDate,
      year: original.year,
      impactSummary: original.impactSummary,
    },
  });

  revalidatePath("/admin/tubewell-projects");
  return copy;
}
