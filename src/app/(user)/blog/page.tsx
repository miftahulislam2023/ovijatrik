import Link from "next/link";
import { getBlogPosts } from "@/actions/blog";
import { getRequestLanguage } from "@/lib/language";
import { stripHtmlToText } from "@/lib/rich-text";
import { ArrowUpRight } from "lucide-react";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const normalizedQuery = q.toLowerCase();

  const language = await getRequestLanguage();
  const posts = await getBlogPosts();

  const filteredPosts = posts.filter((post) => {
    if (!normalizedQuery) return true;

    return (
      post.titleBn.toLowerCase().includes(normalizedQuery) ||
      (post.titleEn || "").toLowerCase().includes(normalizedQuery) ||
      post.markdownBn.toLowerCase().includes(normalizedQuery) ||
      (post.markdownEn || "").toLowerCase().includes(normalizedQuery) ||
      (post.metaTitle || "").toLowerCase().includes(normalizedQuery) ||
      (post.metaDescription || "").toLowerCase().includes(normalizedQuery)
    );
  });

  const copy = {
    en: {
      title: "Blog",
      subtitle: "Read our work, experiences, and stories.",
      empty: "No blog posts have been published yet.",
      minRead: (minutes: number) => `${minutes} min read`,
      journal: "Foundation Journal",
      story: "Story",
      noCover: "No cover image",
      readMore: "Read more",
      searchTitle: "Find a story",
      searchPlaceholder: "Search by title or keywords...",
      searchButton: "Search",
      clearSearch: "Clear",
      showingResults: "Showing stories",
    },
    bn: {
      title: "ব্লগ",
      subtitle: "আমাদের কাজ, অভিজ্ঞতা এবং গল্পগুলো পড়ুন।",
      empty: "এখনও কোনো ব্লগ পোস্ট প্রকাশিত হয়নি।",
      minRead: (minutes: number) => `${minutes} মিনিট পড়া`,
      journal: "ফাউন্ডেশন জার্নাল",
      story: "গল্প",
      noCover: "কভার ছবি নেই",
      readMore: "আরও পড়ুন",
      searchTitle: "গল্প খুঁজুন",
      searchPlaceholder: "শিরোনাম বা কীওয়ার্ড লিখুন...",
      searchButton: "খুঁজুন",
      clearSearch: "রিসেট",
      showingResults: "দেখানো হচ্ছে",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/80 bg-linear-to-b from-amber-50 via-background to-background dark:from-amber-950/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(251,191,36,0.28),transparent_34%),radial-gradient(circle_at_84%_14%,rgba(45,212,191,0.24),transparent_30%),radial-gradient(circle_at_82%_82%,rgba(251,146,60,0.2),transparent_36%)] opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="inline-flex rounded-full border border-amber-600/20 bg-amber-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-900 dark:bg-amber-800/30 dark:text-amber-200">
            {content.journal}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {content.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <form
          className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]"
          method="get"
        >
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {content.searchTitle}
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder={content.searchPlaceholder}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none ring-0 transition-colors placeholder:text-muted-foreground/70 focus:border-amber-500"
            />
          </label>

          <button
            type="submit"
            className="mt-auto h-11 rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white transition hover:bg-amber-500"
          >
            {content.searchButton}
          </button>

          <Link
            href="/blog"
            className="mt-auto inline-flex h-11 items-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-amber-400/60"
          >
            {content.clearSearch}
          </Link>
        </form>

        <div className="mb-6 text-sm font-medium text-muted-foreground">
          {content.showingResults}: {filteredPosts.length}
        </div>

        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post, index) => {
            const title =
              language === "en" ? post.titleEn || post.titleBn : post.titleBn;
            const excerpt = stripHtmlToText(
              language === "en"
                ? post.markdownEn || post.markdownBn
                : post.markdownBn,
            ).slice(0, 170);

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_12px_40px_-22px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-amber-500/40"
              >
                <div className="relative h-56 overflow-hidden bg-muted">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-teal-100 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground dark:from-amber-900/40 dark:to-teal-900/40">
                      {content.noCover}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                    {content.story}
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {title}
                  </h2>

                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {excerpt}
                    {excerpt.length >= 170 ? "..." : ""}
                  </p>

                  <div className="flex items-center justify-between gap-4 pt-1 text-xs text-muted-foreground">
                    <span>
                      {post.readingTime
                        ? content.minRead(post.readingTime)
                        : ""}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      {content.readMore}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {filteredPosts.length === 0 && (
            <p className="text-sm text-muted-foreground">{content.empty}</p>
          )}
        </div>
      </section>
    </main>
  );
}
