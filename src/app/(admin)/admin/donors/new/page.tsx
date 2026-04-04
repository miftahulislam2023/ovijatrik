import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { requireAdminAction } from "@/lib/authorization";
import { uploadImage } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";

export default async function NewDonorPage() {
  await requireAdminAction();

  const language = await getRequestLanguage();
  const isBn = language === "bn";

  async function createAction(formData: FormData) {
    "use server";
    await requireAdminAction();

    const name = String(formData.get("name") || "").trim() || null;
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "").trim();
    const imageUrlInput = String(formData.get("image") || "").trim();

    const imageFile = formData.get("imageFile");
    let image = imageUrlInput || null;

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploaded = await uploadImage(imageFile, "ovijatrik/donors");
      image = uploaded.url;
    }

    if (!email) {
      throw new Error("Email is required");
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    await prisma.user.create({
      data: {
        name,
        email,
        image,
        role: "user",
        password: hashedPassword,
      },
    });

    redirect("/admin/donors");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {isBn ? "নতুন ডোনার" : "New Donor"}
        </h1>
      </div>

      <form
        action={createAction}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#111a23]"
      >
        <input
          name="name"
          placeholder={isBn ? "নাম" : "Name"}
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="email@example.com"
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="password"
          type="password"
          placeholder={isBn ? "পাসওয়ার্ড (ঐচ্ছিক)" : "Password (optional)"}
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="image"
          type="url"
          placeholder={isBn ? "ছবির URL (ঐচ্ছিক)" : "Image URL (optional)"}
          className="h-11 w-full rounded-lg border border-slate-200 px-3 dark:border-white/10 dark:bg-[#0f1720]"
        />
        <input
          name="imageFile"
          type="file"
          accept="image/*"
          className="block w-full text-sm"
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-[#045e6f] text-white hover:bg-[#034c5a]"
          >
            {isBn ? "ডোনার তৈরি করুন" : "Create Donor"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/donors">{isBn ? "ফিরে যান" : "Back"}</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
