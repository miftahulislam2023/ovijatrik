import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createGalleryItem } from "@/actions/gallery";
import { uploadImage } from "@/lib/cloudinary";

export default function NewGalleryItemPage() {
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
    <Card>
      <CardHeader>
        <CardTitle>Add Gallery Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createAction} className="space-y-4">
          <input
            name="titleBn"
            placeholder="Title (Bangla)"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <input
            name="titleEn"
            placeholder="Title (English)"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
          <p className="text-xs text-muted-foreground">
            Upload an image file (JPG, PNG, WEBP). This will be stored in
            Cloudinary.
          </p>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            placeholder="Sort order (0 = first)"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <Button type="submit" className="w-full sm:w-auto">
            Create Gallery Item
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
