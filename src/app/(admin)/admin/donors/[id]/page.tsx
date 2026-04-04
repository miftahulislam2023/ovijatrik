import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { requireAdminAction } from "@/lib/authorization";
import { uploadImage } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";

export default async function EditDonorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminAction();

  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const { id } = await params;

  const donor = await prisma.user.findFirst({
    where: { id, role: "user" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      preferredDonationAmount: true,
      preferredDonationFrequency: true,
      receiveWeeklyDigest: true,
      receiveCampaignAlerts: true,
    },
  });

  if (!donor) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    await requireAdminAction();

    const name = String(formData.get("name") || "").trim() || null;
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "").trim();
    const imageUrlInput = String(formData.get("image") || "").trim();
    const preferredDonationAmount = Number(
      String(formData.get("preferredDonationAmount") || "0"),
    );
    const preferredDonationFrequency = String(
      formData.get("preferredDonationFrequency") || "",
    );

    const imageFile = formData.get("imageFile");
    let image = imageUrlInput || null;

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploaded = await uploadImage(imageFile, "ovijatrik/donors");
      image = uploaded.url;
    }

    if (!email) {
      throw new Error("Email is required");
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        image,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
        preferredDonationAmount:
          Number.isFinite(preferredDonationAmount) &&
          preferredDonationAmount > 0
            ? Math.floor(preferredDonationAmount)
            : null,
        preferredDonationFrequency:
          preferredDonationFrequency === "MONTHLY" ||
          preferredDonationFrequency === "QUARTERLY" ||
          preferredDonationFrequency === "YEARLY"
            ? preferredDonationFrequency
            : null,
        receiveWeeklyDigest: formData.get("receiveWeeklyDigest") === "on",
        receiveCampaignAlerts: formData.get("receiveCampaignAlerts") === "on",
      },
    });

    redirect("/admin/donors");
  }

  async function deleteAction() {
    "use server";
    await requireAdminAction();
    await prisma.user.delete({ where: { id } });
    redirect("/admin/donors");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {isBn ? "ডোনার সম্পাদনা" : "Edit Donor"}
        </h1>
      </div>

      <form
        action={updateAction}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#111a23]"
      >
        <input
          name="name"
          defaultValue={donor.name ?? ""}
          placeholder={isBn ? "নাম" : "Name"}
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="email"
          type="email"
          required
          defaultValue={donor.email ?? ""}
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="password"
          type="password"
          placeholder={
            isBn ? "নতুন পাসওয়ার্ড (ঐচ্ছিক)" : "New password (optional)"
          }
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="image"
          type="url"
          defaultValue={donor.image ?? ""}
          placeholder={isBn ? "ছবির URL" : "Image URL"}
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="imageFile"
          type="file"
          accept="image/*"
          className="block w-full text-sm"
        />

        <input
          name="preferredDonationAmount"
          type="number"
          min={0}
          defaultValue={donor.preferredDonationAmount ?? ""}
          placeholder={
            isBn ? "পছন্দের অনুদান (টাকা)" : "Preferred donation amount"
          }
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />

        <select
          name="preferredDonationFrequency"
          defaultValue={donor.preferredDonationFrequency ?? ""}
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        >
          <option value="">
            {isBn ? "ফ্রিকোয়েন্সি নেই" : "No frequency"}
          </option>
          <option value="MONTHLY">MONTHLY</option>
          <option value="QUARTERLY">QUARTERLY</option>
          <option value="YEARLY">YEARLY</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="receiveWeeklyDigest"
            defaultChecked={donor.receiveWeeklyDigest}
          />
          {isBn ? "সাপ্তাহিক আপডেট" : "Weekly updates"}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="receiveCampaignAlerts"
            defaultChecked={donor.receiveCampaignAlerts}
          />
          {isBn ? "ক্যাম্পেইন এলার্ট" : "Campaign alerts"}
        </label>

        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            className="bg-[#045e6f] text-white hover:bg-[#034c5a]"
          >
            {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/donors">{isBn ? "ফিরে যান" : "Back"}</Link>
          </Button>
        </div>
      </form>

      <form action={deleteAction}>
        <Button variant="destructive" type="submit">
          {isBn ? "ডোনার ডিলিট করুন" : "Delete Donor"}
        </Button>
      </form>
    </div>
  );
}
