"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWeeklyProjects() {
  return prisma.weeklyProject.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWeeklyProjectBySlug(slug: string) {
  return prisma.weeklyProject.findUnique({
    where: { slug },
    include: {
      donations: {
        where: { deletedAt: null },
        orderBy: { date: "desc" },
      },
    },
  });
}

export async function getWeeklyProjectById(id: string) {
  return prisma.weeklyProject.findUnique({
    where: { id },
    include: {
      donations: {
        where: { deletedAt: null },
        orderBy: { date: "desc" },
      },
    },
  });
}

export async function createWeeklyProject(data: {
  titleBn: string;
  titleEn?: string;
  slug: string;
  descriptionBn: string;
  descriptionEn?: string;
  targetAmount: number;
  photos?: string[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  startDate?: Date;
  endDate?: Date;
}) {
  const project = await prisma.weeklyProject.create({
    data: {
      titleBn: data.titleBn,
      titleEn: data.titleEn,
      slug: data.slug,
      descriptionBn: data.descriptionBn,
      descriptionEn: data.descriptionEn,
      targetAmount: data.targetAmount,
      photos: data.photos ?? [],
      status: data.status ?? "DRAFT",
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });

  revalidatePath("/admin/weekly-projects");
  revalidatePath("/weekly-projects");
  return project;
}

export async function updateWeeklyProject(
  id: string,
  data: Partial<{
    titleBn: string;
    titleEn?: string;
    slug: string;
    descriptionBn: string;
    descriptionEn?: string;
    targetAmount: number;
    photos: string[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    startDate?: Date;
    endDate?: Date;
  }>
) {
  const project = await prisma.weeklyProject.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/weekly-projects");
  revalidatePath("/weekly-projects");
  if (data.slug) revalidatePath(`/weekly-projects/${data.slug}`);
  return project;
}

export async function softDeleteWeeklyProject(id: string) {
  const project = await prisma.weeklyProject.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/weekly-projects");
  revalidatePath("/weekly-projects");
  return project;
}

export async function duplicateWeeklyProject(id: string) {
  const original = await prisma.weeklyProject.findUnique({ where: { id } });
  if (!original) return null;

  const copy = await prisma.weeklyProject.create({
    data: {
      titleBn: original.titleBn + " (কপি)",
      titleEn: original.titleEn ? original.titleEn + " (Copy)" : null,
      slug: original.slug + "-copy-" + Date.now().toString().slice(-4),
      descriptionBn: original.descriptionBn,
      descriptionEn: original.descriptionEn,
      targetAmount: original.targetAmount,
      photos: original.photos,
      status: "DRAFT",
      startDate: original.startDate,
      endDate: original.endDate,
    },
  });

  revalidatePath("/admin/weekly-projects");
  return copy;
}

// Weekly donations for a project

export async function addWeeklyDonation(data: {
  projectId: string;
  medium: "BKASH" | "NAGAD" | "ROCKET" | "BANK" | "OTHER";
  amount: number;
  trxid?: string;
  comments?: string;
  phone?: string;
  donorName?: string;
  date?: Date;
}) {
  const donation = await prisma.weeklyDonation.create({
    data: {
      projectId: data.projectId,
      medium: data.medium,
      amount: data.amount,
      trxid: data.trxid,
      comments: data.comments,
      phone: data.phone,
      donorName: data.donorName,
      date: data.date ?? new Date(),
    },
  });

  // update currentAmount
  const aggregate = await prisma.weeklyDonation.aggregate({
    where: { projectId: data.projectId, deletedAt: null },
    _sum: { amount: true },
  });

  await prisma.weeklyProject.update({
    where: { id: data.projectId },
    data: { currentAmount: aggregate._sum.amount ?? 0 },
  });

  revalidatePath("/admin/weekly-projects");
  revalidatePath("/weekly-projects");
  return donation;
}

export async function softDeleteWeeklyDonation(id: string) {
  const donation = await prisma.weeklyDonation.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  // recompute project currentAmount
  const aggregate = await prisma.weeklyDonation.aggregate({
    where: { projectId: donation.projectId, deletedAt: null },
    _sum: { amount: true },
  });

  await prisma.weeklyProject.update({
    where: { id: donation.projectId },
    data: { currentAmount: aggregate._sum.amount ?? 0 },
  });

  revalidatePath("/admin/weekly-projects");
  revalidatePath("/weekly-projects");
  return donation;
}
