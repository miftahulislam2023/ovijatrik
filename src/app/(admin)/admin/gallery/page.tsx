import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminGalleryPage() {
    const items = await prisma.galleryItem.findMany({
        where: { deletedAt: null },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Gallery</h1>
                <Button asChild>
                    <Link href="/admin/gallery/new">Add Image</Link>
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <CardTitle className="text-base">{item.titleEn || item.titleBn || "Untitled"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Image
                                src={item.imageUrl}
                                alt={item.titleEn || item.titleBn || "Gallery item"}
                                width={900}
                                height={600}
                                className="h-44 w-full rounded-md object-cover"
                                unoptimized
                            />
                            <div className="flex items-center justify-between text-sm">
                                <p className="text-muted-foreground">Sort: {item.sortOrder}</p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/gallery/${item.id}`}>Edit</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
