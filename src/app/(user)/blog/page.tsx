import Link from "next/link";
import { getBlogPosts } from "@/actions/blog";
import { getRequestLanguage } from "@/lib/language";

export default async function BlogPage() {
  const language = await getRequestLanguage();
  const posts = await getBlogPosts();

  const copy = {
    en: {
      title: "Blog",
      subtitle: "Read our work, experiences, and stories.",
      empty: "No blog posts have been published yet.",
      minRead: (minutes: number) => `${minutes} min read`,
    },
    bn: {
      title: "ব্লগ",
      subtitle: "আমাদের কাজ, অভিজ্ঞতা এবং গল্পগুলো পড়ুন।",
      empty: "এখনও কোনো ব্লগ পোস্ট প্রকাশিত হয়নি।",
      minRead: (minutes: number) => `${minutes} মিনিট পড়া`,
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

        <div className="mt-8 space-y-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
            >
              <h2 className="text-base font-semibold">
                {language === "en"
                  ? post.titleEn || post.titleBn
                  : post.titleBn}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {(language === "en"
                  ? post.markdownEn || post.markdownBn
                  : post.markdownBn
                ).slice(0, 160)}
                ...
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {post.readingTime ? content.minRead(post.readingTime) : ""}
              </p>
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground">{content.empty}</p>
          )}
        </div>
      </section>
    </main>
  );
}
