import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  duplicateGalleryItem,
  softDeleteGalleryItem,
  updateGalleryItem,
} from "@/actions/gallery";
import { uploadImage } from "@/lib/cloudinary";
import { redirect } from "next/navigation";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { ArrowLeft, Copy, Save, Trash2 } from "lucide-react";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "গ্যালারি আইটেম সম্পাদনা",
        itemAlt: "আইটেম",
        save: "পরিবর্তন সংরক্ষণ",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
      }
    : {
        title: "Edit Gallery Item",
        itemAlt: "Item",
        save: "Save Changes",
        duplicate: "Duplicate",
        archive: "Archive",
      };

  const { id } = await params;
  const item = await prisma.galleryItem.findFirst({
    where: { id, deletedAt: null },
  });

  if (!item) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    const titleBn = String(formData.get("titleBn") || "").trim();
    const titleEn = String(formData.get("titleEn") || "").trim();
    const sortOrder = Number(formData.get("sortOrder") || 0);
    const imageFile = formData.get("imageFile");

    let imageUrl = item.imageUrl;
    if (imageFile instanceof File && imageFile.size > 0) {
      const uploaded = await uploadImage(imageFile, "ovijatrik/gallery");
      imageUrl = uploaded.url;
    }

    await updateGalleryItem(id, {
      titleBn: titleBn || undefined,
      titleEn: titleEn || undefined,
      imageUrl,
      sortOrder,
    });

    redirect("/admin/gallery");
  }

  async function duplicateAction() {
    "use server";
    await duplicateGalleryItem(id);
    redirect("/admin/gallery");
  }

  async function deleteAction() {
    "use server";
    await softDeleteGalleryItem(id);
    redirect("/admin/gallery");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121923]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/gallery"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {isBn ? "গ্যালারি আইটেম" : "Gallery Item"}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {copy.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <form action={duplicateAction}>
            <Button
              type="submit"
              variant="outline"
              className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <Copy className="h-4 w-4" />
              {copy.duplicate}
            </Button>
          </form>
          <form action={deleteAction}>
            <Button
              type="submit"
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              {copy.archive}
            </Button>
          </form>
          <Button
            type="submit"
            form="gallery-edit-form"
            className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
          >
            <Save className="h-4 w-4" />
            {copy.save}
          </Button>
        </div>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 dark:border-white/10 dark:bg-[#121d29]">
        <Image
          src={item.imageUrl}
          alt={item.titleEn || item.titleBn || copy.itemAlt}
          width={900}
          height={600}
          className="h-56 w-full rounded-xl object-cover"
          unoptimized
        />
        <form
          id="gallery-edit-form"
          action={updateAction}
          className="space-y-4"
        >
          <input
            name="titleBn"
            defaultValue={item.titleBn ?? ""}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <input
            name="titleEn"
            defaultValue={item.titleEn ?? ""}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <input
            name="sortOrder"
            type="number"
            defaultValue={item.sortOrder}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
          />
          <Button
            type="submit"
            className="w-full rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] py-6 text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99] sm:w-auto"
          >
            {copy.save}
          </Button>
        </form>
      </section>
    </div>
  );
}
