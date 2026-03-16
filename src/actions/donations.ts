"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDonations() {
  return prisma.donation.findMany({
    where: { deletedAt: null },
    orderBy: { date: "desc" },
  });
}

export async function getDonationById(id: string) {
  return prisma.donation.findUnique({
    where: { id },
  });
}

export async function createDonation(data: {
  medium: "BKASH" | "NAGAD" | "ROCKET" | "BANK" | "OTHER";
  amount: number;
  trxid?: string;
  comments?: string;
  phone?: string;
  donorName?: string;
  type?: "GENERAL" | "ZAKAT" | "SADAQAH" | "EMERGENCY" | "RAMADAN" | "OTHER";
  date?: Date;
}) {
  const donation = await prisma.donation.create({
    data: {
      medium: data.medium,
      amount: data.amount,
      trxid: data.trxid,
      comments: data.comments,
      phone: data.phone,
      donorName: data.donorName,
      type: data.type ?? "GENERAL",
      date: data.date ?? new Date(),
    },
  });

  revalidatePath("/admin/donations");
  return donation;
}

export async function updateDonation(
  id: string,
  data: Partial<{
    medium: "BKASH" | "NAGAD" | "ROCKET" | "BANK" | "OTHER";
    amount: number;
    trxid?: string;
    comments?: string;
    phone?: string;
    donorName?: string;
    type?: "GENERAL" | "ZAKAT" | "SADAQAH" | "EMERGENCY" | "RAMADAN" | "OTHER";
    date?: Date;
  }>
) {
  const donation = await prisma.donation.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/donations");
  return donation;
}

export async function softDeleteDonation(id: string) {
  const donation = await prisma.donation.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/donations");
  return donation;
}

export async function duplicateDonation(id: string) {
  const original = await prisma.donation.findUnique({ where: { id } });
  if (!original) return null;

  const copy = await prisma.donation.create({
    data: {
      medium: original.medium,
      amount: original.amount,
      trxid: original.trxid,
      comments: original.comments,
      phone: original.phone,
      donorName: original.donorName,
      type: original.type,
      date: original.date,
    },
  });

  revalidatePath("/admin/donations");
  return copy;
}
