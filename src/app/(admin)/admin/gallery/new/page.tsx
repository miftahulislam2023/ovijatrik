import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createGalleryItem } from "@/actions/gallery";
import { uploadImage } from "@/lib/cloudinary";
import { getRequestLanguage } from "@/lib/language";

export default async function NewGalleryItemPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "গ্যালারি আইটেম যোগ করুন",
        titleBn: "শিরোনাম (বাংলা)",
        titleEn: "শিরোনাম (ইংরেজি)",
        uploadHint:
          "ছবি আপলোড করুন (JPG, PNG, WEBP)। এটি Cloudinary-তে সংরক্ষিত হবে।",
        sortOrder: "সাজানোর ক্রম (0 = প্রথম)",
        submit: "গ্যালারি আইটেম তৈরি করুন",
      }
    : {
        title: "Add Gallery Item",
        titleBn: "Title (Bangla)",
        titleEn: "Title (English)",
        uploadHint:
          "Upload an image file (JPG, PNG, WEBP). This will be stored in Cloudinary.",
        sortOrder: "Sort order (0 = first)",
        submit: "Create Gallery Item",
      };

  async function createAction(formData: FormData) {
    "use server";
    const titleBn = String(formData.get("titleBn") || "").trim();
    const titleEn = String(formData.get("titleEn") || "").trim();
    const sortOrder = Number(formData.get("sortOrder") || 0);
    const imageFile = formData.get("imageFile");

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      throw new Error("Please upload an image file");
    }

    const uploaded = await uploadImage(imageFile, "ovijatrik/gallery");

    await createGalleryItem({
      titleBn: titleBn || undefined,
      titleEn: titleEn || undefined,
      imageUrl: uploaded.url,
      sortOrder,
    });

    redirect("/admin/gallery");
  }

  return (
    <Card className="dark:border-white/10 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          {copy.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createAction} className="space-y-4">
          <input
            name="titleBn"
            placeholder={copy.titleBn}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="titleEn"
            placeholder={copy.titleEn}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <p className="text-xs text-muted-foreground">{copy.uploadHint}</p>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            placeholder={copy.sortOrder}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button type="submit" className="w-full sm:w-auto">
            {copy.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
