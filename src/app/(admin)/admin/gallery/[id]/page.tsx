import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await prisma.galleryItem.findFirst({ where: { id, deletedAt: null } });

    if (!item) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Gallery Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <Image src={item.imageUrl} alt={item.titleEn || item.titleBn || "Item"} width={900} height={600} className="h-56 w-full rounded-md object-cover" unoptimized />
                Full edit form will be added next.
            </CardContent>
        </Card>
    );
}
