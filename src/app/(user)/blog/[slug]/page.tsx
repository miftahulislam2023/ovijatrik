import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/actions/blog";
import ReactMarkdown from "react-markdown";
import { getRequestLanguage } from "@/lib/language";

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
    },
    bn: {
      minRead: (minutes: number) => `${minutes} মিনিট পড়া`,
    },
  } as const;

  const content = copy[language];
  const title = language === "en" ? post.titleEn || post.titleBn : post.titleBn;
  const markdown =
    language === "en" ? post.markdownEn || post.markdownBn : post.markdownBn;

  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {post.readingTime ? content.minRead(post.readingTime) : ""}
        </p>

        {post.coverImage && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-sm mt-8 max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
