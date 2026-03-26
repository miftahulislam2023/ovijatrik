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
    const imageUrlInput = String(formData.get("imageUrl") || "").trim();
    const sortOrder = Number(formData.get("sortOrder") || 0);
    const imageFile = formData.get("imageFile");

    let imageUrl = imageUrlInput;
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const uploaded = await uploadImage(imageFile, "ovijatrik/gallery");
        imageUrl = uploaded.url;
      } catch (error) {
        if (
          imageUrlInput &&
          error instanceof Error &&
          error.message.includes("Cloudinary is not configured")
        ) {
          imageUrl = imageUrlInput;
        } else {
          throw error;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Image URL or image file is required");
    }

    await createGalleryItem({
      titleBn: titleBn || undefined,
      titleEn: titleEn || undefined,
      imageUrl,
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
            name="imageUrl"
            placeholder="Image URL"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="w-full rounded-md border border-input px-3 py-2"
          />
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
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
