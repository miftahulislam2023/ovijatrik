import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { duplicateGalleryItem, softDeleteGalleryItem } from "@/actions/gallery";

export default async function AdminGalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const params = await searchParams;
    const q = (params.q || "").trim();
    const page = Math.max(1, Number(params.page || "1") || 1);
    const pageSize = 12;

    const where = {
        deletedAt: null,
        ...(q
            ? {
                OR: [
                    { titleBn: { contains: q, mode: "insensitive" as const } },
                    { titleEn: { contains: q, mode: "insensitive" as const } },
                ],
            }
            : {}),
    };

    const [items, totalCount] = await Promise.all([
        prisma.galleryItem.findMany({
            where,
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.galleryItem.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const prevPage = Math.max(1, page - 1);
    const nextPage = Math.min(totalPages, page + 1);

    const queryWithPage = (targetPage: number) => {
        const qp = new URLSearchParams();
        if (q) qp.set("q", q);
        qp.set("page", String(targetPage));
        return `/admin/gallery?${qp.toString()}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Gallery</h1>
                <Button asChild>
                    <Link href="/admin/gallery/new">Add Image</Link>
                </Button>
            </div>

            <form className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_auto]" method="get">
                <input name="q" defaultValue={q} placeholder="Search title" className="rounded-md border border-input px-3 py-2" />
                <Button type="submit">Apply</Button>
            </form>

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
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/gallery/${item.id}`}>Edit</Link>
                                    </Button>
                                    <form action={async () => {
                                        "use server";
                                        await duplicateGalleryItem(item.id);
                                    }}>
                                        <Button variant="outline" size="sm" type="submit">Duplicate</Button>
                                    </form>
                                    <form action={async () => {
                                        "use server";
                                        await softDeleteGalleryItem(item.id);
                                    }}>
                                        <Button variant="destructive" size="sm" type="submit">Archive</Button>
                                    </form>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {items.length === 0 && (
                    <Card className="md:col-span-2 xl:col-span-3">
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            No gallery items found.
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Page {page} of {totalPages} ({totalCount} items)</p>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" disabled={page <= 1}>
                        <Link href={queryWithPage(prevPage)}>Previous</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
                        <Link href={queryWithPage(nextPage)}>Next</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
