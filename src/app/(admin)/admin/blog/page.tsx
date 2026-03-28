import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  bulkDeleteBlogPostsPermanently,
  bulkSoftDeleteBlogPosts,
  deleteBlogPostPermanently,
  duplicateBlogPost,
  softDeleteBlogPost,
} from "@/actions/blog";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import { getRequestLanguage } from "@/lib/language";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    state?: string;
    featured?: string;
    page?: string;
  }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        badge: "অ্যাডমিন / কনটেন্ট ম্যানেজমেন্ট",
        title: "সম্পাদকীয় পাইপলাইন",
        subtitle:
          "মিশনকে এগিয়ে নেওয়া গল্প তৈরি করুন এবং প্রকাশনার মান বজায় রাখুন।",
        newEntry: "নতুন এন্ট্রি",
        search: "শিরোনাম বা স্লাগ দিয়ে খুঁজুন",
        allStates: "সব অবস্থা",
        allFeaturedStates: "সব ফিচার্ড অবস্থা",
        apply: "প্রয়োগ করুন",
        published: "প্রকাশিত",
        draft: "খসড়া",
        featured: "ফিচার্ড",
        articlePerformance: "আর্টিকেল পারফরম্যান্স",
        totalPostsInView: "এই ভিউতে মোট পোস্ট",
        liveStories: "লাইভ গল্প",
        homepageHighlights: "হোমপেজ হাইলাইটস",
        notFeatured: "ফিচার্ড নয়",
        view: "দেখুন",
        edit: "এডিট",
        duplicate: "ডুপ্লিকেট",
        archive: "আর্কাইভ",
        delete: "ডিলিট",
        selectedActions: "নির্বাচিত পোস্টের অ্যাকশন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        deleteSelected: "নির্বাচিত ডিলিট",
        select: "নির্বাচন",
        noData: "কোনো ব্লগ পোস্ট পাওয়া যায়নি।",
        updated: "আপডেট হয়েছে",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        badge: "Admin / Content Management",
        title: "Editorial Pipeline",
        subtitle:
          "Curate stories that drive the mission and keep publication quality consistent.",
        newEntry: "New Entry",
        search: "Search title or slug",
        allStates: "All states",
        allFeaturedStates: "All featured states",
        apply: "Apply",
        published: "Published",
        draft: "Draft",
        featured: "Featured",
        articlePerformance: "Article Performance",
        totalPostsInView: "Total posts in this view",
        liveStories: "Live stories",
        homepageHighlights: "Homepage highlights",
        notFeatured: "Not featured",
        view: "View",
        edit: "Edit",
        duplicate: "Duplicate",
        archive: "Archive",
        delete: "Delete",
        selectedActions: "Actions for selected posts",
        archiveSelected: "Archive Selected",
        deleteSelected: "Delete Selected",
        select: "Select",
        noData: "No blog posts found.",
        updated: "Updated",
        page: "Page",
        of: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

  const params = await searchParams;
  const q = (params.q || "").trim();
  const state = (params.state || "").trim();
  const featured = (params.featured || "").trim();
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 10;

  const where = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { titleBn: { contains: q, mode: "insensitive" as const } },
            { titleEn: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(state === "published" ? { published: true } : {}),
    ...(state === "draft" ? { published: false } : {}),
    ...(featured === "yes" ? { featured: true } : {}),
    ...(featured === "no" ? { featured: false } : {}),
  };

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const publishedCount = posts.filter((post) => post.published).length;
  const featuredCount = posts.filter((post) => post.featured).length;

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (state) qp.set("state", state);
    if (featured) qp.set("featured", featured);
    qp.set("page", String(targetPage));
    return `/admin/blog?${qp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {copy.badge}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {copy.subtitle}
            </p>
          </div>
          <Button
            asChild
            className="h-11 rounded-2xl bg-[#045e6f] px-5 text-white hover:bg-[#034c5a]"
          >
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4" />
              {copy.newEntry}
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#142730]">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
              {copy.articlePerformance}
            </p>
            <p className="mt-1 text-3xl font-black text-[#0b4f6d] dark:text-[#7ed4e4] sm:text-4xl">
              {totalCount}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {copy.totalPostsInView}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              {copy.published}
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-300 sm:text-4xl">
              {publishedCount}
            </p>
            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
              {copy.liveStories}
            </p>
          </div>
          <div className="rounded-2xl border border-[#ffd1bf] bg-[#fff2ea] p-4 dark:border-[#9c4f2f]/40 dark:bg-[#2b1f1a]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9c4f2f] dark:text-[#ffc3a8]">
              {copy.featured}
            </p>
            <p className="mt-1 text-3xl font-black text-[#9c4f2f] dark:text-[#ffd1bf] sm:text-4xl">
              {featuredCount}
            </p>
            <p className="mt-1 text-xs text-[#9c4f2f]/80 dark:text-[#ffc3a8]/80">
              {copy.homepageHighlights}
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#dbe8f1] p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_180px_auto] dark:border-white/10 dark:bg-[#13202a]"
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
        <select
          name="state"
          defaultValue={state}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.allStates}</option>
          <option value="published">{copy.published}</option>
          <option value="draft">{copy.draft}</option>
        </select>
        <select
          name="featured"
          defaultValue={featured}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.allFeaturedStates}</option>
          <option value="yes">{copy.featured}</option>
          <option value="no">{copy.notFeatured}</option>
        </select>
        <Button
          type="submit"
          className="h-11 rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a]"
        >
          {copy.apply}
        </Button>
      </form>

      <form
        id="blog-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkSoftDeleteBlogPosts}
          variant="outline"
          size="sm"
        >
          {copy.archiveSelected}
        </Button>
        <Button
          type="submit"
          formAction={bulkDeleteBlogPostsPermanently}
          variant="destructive"
          size="sm"
        >
          {copy.deleteSelected}
        </Button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:border-[#0b5e7a]/40 dark:border-white/10 dark:bg-[#111a23] md:grid-cols-[220px_1fr_auto] md:items-center"
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImage}
                  alt={post.titleEn || post.titleBn}
                  className="aspect-16/10 h-full w-full object-cover"
                />
              ) : (
                <div className="aspect-16/10 w-full bg-linear-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900" />
              )}
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${post.published ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"}`}
                >
                  {post.published ? copy.published : copy.draft}
                </span>
                {post.featured ? (
                  <span className="rounded-full bg-[#ffe6da] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9c4f2f] dark:bg-[#3a2720] dark:text-[#ffc3a8]">
                    {copy.featured}
                  </span>
                ) : null}
              </div>

              <h2 className="text-xl font-black leading-tight text-slate-900 dark:text-white sm:text-2xl">
                {isBn
                  ? post.titleBn || post.titleEn
                  : post.titleEn || post.titleBn}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                /{post.slug}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {copy.updated} {post.updatedAt.toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
              <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-white/15 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="ids"
                  value={post.id}
                  form="blog-bulk-actions"
                  className="h-4 w-4"
                />
                {copy.select}
              </label>
              <Button asChild variant="outline" size="sm">
                <Link href={`/blog/${post.slug}`}>
                  <Eye className="h-3.5 w-3.5" />
                  {copy.view}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/blog/${post.id}`}>
                  <Pencil className="h-3.5 w-3.5" />
                  {copy.edit}
                </Link>
              </Button>
              <form
                action={async () => {
                  "use server";
                  await duplicateBlogPost(post.id);
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  {copy.duplicate}
                </Button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await softDeleteBlogPost(post.id);
                }}
              >
                <Button variant="destructive" size="sm" type="submit">
                  {copy.archive}
                </Button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteBlogPostPermanently(post.id);
                }}
              >
                <Button variant="destructive" size="sm" type="submit">
                  {copy.delete}
                </Button>
              </form>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
            {copy.noData}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600 dark:text-slate-300">
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
