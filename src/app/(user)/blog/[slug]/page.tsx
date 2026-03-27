import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/actions/blog";
import ReactMarkdown from "react-markdown";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";
import { isLikelyHtml, sanitizeRichText } from "@/lib/rich-text";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const language = await getRequestLanguage();
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.deletedAt || !post.published) {
    notFound();
  }

  const copy = {
    en: {
      minRead: (minutes: number) => `${minutes} min read`,
      impactStory: "Impact Story",
      publishedOn: "Published",
      impactSnapshot: "Impact Snapshot",
      readingTime: "Reading Time",
      language: "Language",
      status: "Status",
      published: "Published",
      fallbackTags: ["Sustainability", "Water Rights", "Community Development"],
      relatedStories: "Related Stories",
      viewAll: "View all",
      editorial: "Editorial",
      bangla: "Bangla",
      english: "English",
    },
    bn: {
      minRead: (minutes: number) => `${minutes} মিনিট পড়া`,
      impactStory: "প্রভাবের গল্প",
      publishedOn: "প্রকাশিত",
      impactSnapshot: "প্রভাবের সংক্ষিপ্তচিত্র",
      readingTime: "পড়ার সময়",
      language: "ভাষা",
      status: "অবস্থা",
      published: "প্রকাশিত",
      fallbackTags: ["টেকসই উন্নয়ন", "পানির অধিকার", "কমিউনিটি উন্নয়ন"],
      relatedStories: "সম্পর্কিত গল্প",
      viewAll: "সবগুলো দেখুন",
      editorial: "সম্পাদকীয়",
      bangla: "বাংলা",
      english: "ইংরেজি",
    },
  } as const;

  const content = copy[language];
  const title = language === "en" ? post.titleEn || post.titleBn : post.titleBn;
  const markdown =
    language === "en" ? post.markdownEn || post.markdownBn : post.markdownBn;
  const contentIsHtml = isLikelyHtml(markdown);
  const safeContent = contentIsHtml ? sanitizeRichText(markdown) : markdown;

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      deletedAt: null,
      published: true,
      id: { not: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      slug: true,
      titleBn: true,
      titleEn: true,
      coverImage: true,
    },
  });

  const publishDate = post.updatedAt || post.createdAt;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border bg-primary/35">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/75 to-background/95" />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <p className="inline-flex rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
            {content.impactStory}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] text-white md:text-6xl">
            {title}
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-6 text-xs text-slate-100/90">
            <span>
              {content.publishedOn}{" "}
              {publishDate.toLocaleDateString(
                language === "bn" ? "bn-BD" : "en-US",
                { month: "long", day: "numeric", year: "numeric" },
              )}
            </span>
            {post.readingTime ? (
              <span>{content.minRead(post.readingTime)}</span>
            ) : null}
          </div>
        </div>
      </section>

      <article className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-2xl border border-border bg-muted p-5 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {content.impactSnapshot}
          </p>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {content.readingTime}
              </dt>
              <dd className="text-2xl font-semibold text-primary">
                {post.readingTime || 5} min
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {content.language}
              </dt>
              <dd className="text-xl font-semibold text-primary">
                {language === "bn" ? content.bangla : content.english}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {content.status}
              </dt>
              <dd className="text-xl font-semibold text-primary">
                {content.published}
              </dd>
            </div>
          </dl>
        </aside>

        <div>
          <div className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground/85 prose-a:text-primary first-letter:text-primary max-w-none prose-p:leading-8 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.8] dark:prose-invert">
            {contentIsHtml ? (
              <div dangerouslySetInnerHTML={{ __html: safeContent }} />
            ) : (
              <ReactMarkdown>{markdown}</ReactMarkdown>
            )}
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <div className="flex flex-wrap gap-2">
              {(post.metaTitle ? [post.metaTitle] : content.fallbackTags).map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-muted/60 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-semibold text-foreground">
              {content.relatedStories}
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              {content.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {relatedPosts.map((item) => {
              const relatedTitle =
                language === "en" ? item.titleEn || item.titleBn : item.titleBn;

              return (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="aspect-16/10 overflow-hidden bg-muted">
                    {item.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImage}
                        alt={relatedTitle}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl font-semibold text-slate-400">
                        •
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {content.editorial}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">
                      {relatedTitle}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
