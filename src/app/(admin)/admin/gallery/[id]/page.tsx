import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  duplicateGalleryItem,
  softDeleteGalleryItem,
  updateGalleryItem,
} from "@/actions/gallery";
import { uploadImage } from "@/lib/cloudinary";
import { redirect } from "next/navigation";
import { getRequestLanguage } from "@/lib/language";

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
    <Card className="dark:border-white/10 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          {copy.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Image
          src={item.imageUrl}
          alt={item.titleEn || item.titleBn || copy.itemAlt}
          width={900}
          height={600}
          className="h-56 w-full rounded-md object-cover"
          unoptimized
        />
        <form action={updateAction} className="space-y-4">
          <input
            name="titleBn"
            defaultValue={item.titleBn ?? ""}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="titleEn"
            defaultValue={item.titleEn ?? ""}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="sortOrder"
            type="number"
            defaultValue={item.sortOrder}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button type="submit" className="w-full sm:w-auto">
            {copy.save}
          </Button>
        </form>
        <div className="flex flex-wrap gap-3">
          <form action={duplicateAction}>
            <Button type="submit" variant="outline">
              {copy.duplicate}
            </Button>
          </form>
          <form action={deleteAction}>
            <Button type="submit" variant="destructive">
              {copy.archive}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
