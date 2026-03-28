import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  bulkSoftDeleteGalleryItems,
  duplicateGalleryItem,
  softDeleteGalleryItem,
} from "@/actions/gallery";
import { getRequestLanguage } from "@/lib/language";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "গ্যালারি",
        addImage: "ছবি যোগ করুন",
        search: "শিরোনাম দিয়ে খুঁজুন",
        apply: "প্রয়োগ করুন",
        untitled: "শিরোনামহীন",
        itemAlt: "গ্যালারি আইটেম",
        sort: "ক্রম",
        edit: "এডিট",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        selectedActions: "নির্বাচিত আইটেমের অ্যাকশন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        select: "নির্বাচন",
        noData: "কোনো গ্যালারি আইটেম পাওয়া যায়নি।",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        title: "Gallery",
        addImage: "Add Image",
        search: "Search title",
        apply: "Apply",
        untitled: "Untitled",
        itemAlt: "Gallery item",
        sort: "Sort",
        edit: "Edit",
        duplicate: "Duplicate",
        archive: "Archive",
        selectedActions: "Actions for selected items",
        archiveSelected: "Archive Selected",
        select: "Select",
        noData: "No gallery items found.",
        page: "Page",
        of: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {copy.title}
        </h1>
        <Button asChild>
          <Link href="/admin/gallery/new">{copy.addImage}</Link>
        </Button>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[1fr_auto]"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder={copy.search}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        />
        <Button type="submit" className="w-full sm:w-auto">
          {copy.apply}
        </Button>
      </form>

      <form
        id="gallery-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkSoftDeleteGalleryItems}
          variant="destructive"
          size="sm"
        >
          {copy.archiveSelected}
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">
                  {isBn
                    ? item.titleBn || item.titleEn || copy.untitled
                    : item.titleEn || item.titleBn || copy.untitled}
                </CardTitle>
                <label className="inline-flex items-center gap-2 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    name="ids"
                    value={item.id}
                    form="gallery-bulk-actions"
                    className="h-4 w-4"
                  />
                  {copy.select}
                </label>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Image
                src={item.imageUrl}
                alt={item.titleEn || item.titleBn || copy.itemAlt}
                width={900}
                height={600}
                className="h-44 w-full rounded-md object-cover"
                unoptimized
              />
              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground">
                  {copy.sort}: {item.sortOrder}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/gallery/${item.id}`}>{copy.edit}</Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await duplicateGalleryItem(item.id);
                    }}
                  >
                    <Button variant="outline" size="sm" type="submit">
                      {copy.duplicate}
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await softDeleteGalleryItem(item.id);
                    }}
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      {copy.archive}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <Card className="md:col-span-2 xl:col-span-3">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              {copy.noData}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {copy.page} {page} {copy.of} {totalPages} ({totalCount} {copy.items})
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" disabled={page <= 1}>
            <Link href={queryWithPage(prevPage)}>{copy.previous}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            <Link href={queryWithPage(nextPage)}>{copy.next}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
