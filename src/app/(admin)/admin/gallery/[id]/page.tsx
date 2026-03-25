import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { duplicateGalleryItem, softDeleteGalleryItem, updateGalleryItem } from "@/actions/gallery";
import { uploadImage } from "@/lib/cloudinary";
import { redirect } from "next/navigation";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await prisma.galleryItem.findFirst({ where: { id, deletedAt: null } });

    if (!item) {
        notFound();
    }

    async function updateAction(formData: FormData) {
        "use server";
        const titleBn = String(formData.get("titleBn") || "").trim();
        const titleEn = String(formData.get("titleEn") || "").trim();
        const imageUrlInput = String(formData.get("imageUrl") || "").trim();
        const sortOrder = Number(formData.get("sortOrder") || 0);
        const imageFile = formData.get("imageFile");

        let imageUrl = imageUrlInput;
        if (imageFile instanceof File && imageFile.size > 0) {
            const uploaded = await uploadImage(imageFile, "ovijatrik/gallery");
            imageUrl = uploaded.url;
        }

        await updateGalleryItem(id, {
            titleBn: titleBn || undefined,
            titleEn: titleEn || undefined,
            imageUrl: imageUrl || item.imageUrl,
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
        <Card>
            <CardHeader>
                <CardTitle>Edit Gallery Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Image src={item.imageUrl} alt={item.titleEn || item.titleBn || "Item"} width={900} height={600} className="h-56 w-full rounded-md object-cover" unoptimized />
                <form action={updateAction} className="space-y-4">
                    <input name="titleBn" defaultValue={item.titleBn ?? ""} className="w-full rounded-md border border-input px-3 py-2" />
                    <input name="titleEn" defaultValue={item.titleEn ?? ""} className="w-full rounded-md border border-input px-3 py-2" />
                    <input name="imageUrl" defaultValue={item.imageUrl} className="w-full rounded-md border border-input px-3 py-2" />
                    <input name="imageFile" type="file" accept="image/*" className="w-full rounded-md border border-input px-3 py-2" />
                    <input name="sortOrder" type="number" defaultValue={item.sortOrder} className="w-full rounded-md border border-input px-3 py-2" />
                    <Button type="submit">Save Changes</Button>
                </form>
                <div className="flex gap-3">
                    <form action={duplicateAction}><Button type="submit" variant="outline">Duplicate</Button></form>
                    <form action={deleteAction}><Button type="submit" variant="destructive">Archive</Button></form>
                </div>
            </CardContent>
        </Card>
    );
}
