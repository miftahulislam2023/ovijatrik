import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  bulkDeleteGalleryItemsPermanently,
  bulkSoftDeleteGalleryItems,
  deleteGalleryItemPermanently,
  duplicateGalleryItem,
  softDeleteGalleryItem,
} from "@/actions/gallery";
import { BulkSelectionCount } from "@/components/admin/bulk-selection-count";
import { getRequestLanguage } from "@/lib/language";
import { Copy, Pencil, Plus, Search, Trash2 } from "lucide-react";

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
        delete: "স্থায়ী ডিলিট",
        selectedActions: "নির্বাচিত আইটেমের অ্যাকশন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        deleteSelected: "নির্বাচিত স্থায়ী ডিলিট",
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
        delete: "Delete",
        selectedActions: "Actions for selected items",
        archiveSelected: "Archive Selected",
        deleteSelected: "Delete Selected",
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
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {isBn ? "অ্যাডমিন / মিডিয়া লাইব্রেরি" : "Admin / Media Library"}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {isBn
                ? "ফাউন্ডেশনের ভিজ্যুয়াল গল্পগুলো সাজান, আপডেট করুন এবং আর্কাইভ করুন।"
                : "Organize, update, and archive your foundation visual stories."}
            </p>
          </div>
          <Button
            asChild
            className="h-11 rounded-full bg-[#045e6f] px-5 text-white hover:bg-[#034c5a]"
          >
            <Link href="/admin/gallery/new">
              <Plus className="h-4 w-4" />
              {copy.addImage}
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#055763] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">
              {isBn ? "মোট আইটেম" : "Total Items"}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-[#ffd1bf] bg-[#fff2ea] p-4 dark:border-[#9c4f2f]/40 dark:bg-[#2b1f1a]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9c4f2f] dark:text-[#ffc3a8]">
              {isBn ? "শুধু এই পেজ" : "On This Page"}
            </p>
            <p className="mt-1 text-3xl font-black text-[#9c4f2f] dark:text-[#ffd1bf] sm:text-4xl">
              {items.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#eef5f8] p-4 dark:border-white/10 dark:bg-[#1a2630]">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              {isBn ? "বর্তমান অনুসন্ধান" : "Current Query"}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {q || "-"}
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#dbe8f1] p-3 sm:grid-cols-[1fr_auto] dark:border-white/10 dark:bg-[#13202a]"
        method="get"
      >
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder={copy.search}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
          />
        </label>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a] sm:w-auto"
        >
          {copy.apply}
        </Button>
      </form>

      <form
        id="gallery-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <BulkSelectionCount
          formId="gallery-bulk-actions"
          emptyLabel={copy.selectedActions}
          selectedLabelTemplate="{count} selected"
          className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300"
        />
        <Button
          type="submit"
          formAction={bulkSoftDeleteGalleryItems}
          size="sm"
          className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          {copy.archiveSelected}
        </Button>
        <Button
          type="submit"
          formAction={bulkDeleteGalleryItemsPermanently}
          variant="destructive"
          size="sm"
        >
          {copy.deleteSelected}
        </Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#0b5e7a]/40 dark:border-white/10 dark:bg-[#111a23]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {isBn
                  ? item.titleBn || item.titleEn || copy.untitled
                  : item.titleEn || item.titleBn || copy.untitled}
              </p>
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-white/15 dark:text-slate-300">
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

            <div className="mt-3 space-y-3">
              <Image
                src={item.imageUrl}
                alt={item.titleEn || item.titleBn || copy.itemAlt}
                width={900}
                height={600}
                className="h-32 w-full rounded-xl object-cover"
                unoptimized
              />
              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-500 dark:text-slate-300">
                  {copy.sort}: {item.sortOrder}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-[#0c5f72] text-[#0c5f72] hover:bg-[#0c5f72] hover:text-white dark:border-[#66bdd0] dark:text-[#8dd6e4]"
                  >
                    <Link href={`/admin/gallery/${item.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                      {copy.edit}
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await duplicateGalleryItem(item.id);
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      type="submit"
                      className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copy.duplicate}
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await softDeleteGalleryItem(item.id);
                    }}
                  >
                    <Button
                      size="sm"
                      type="submit"
                      className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {copy.archive}
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await deleteGalleryItemPermanently(item.id);
                    }}
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      <Trash2 className="h-3.5 w-3.5" />
                      {copy.delete}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm md:col-span-2 xl:col-span-3 dark:border-white/10 dark:bg-[#111a23] dark:text-slate-300">
            {copy.noData}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500 dark:text-slate-300">
          {copy.page} {page} {copy.of} {totalPages} ({totalCount} {copy.items})
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page <= 1}
            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href={queryWithPage(prevPage)}>{copy.previous}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href={queryWithPage(nextPage)}>{copy.next}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
