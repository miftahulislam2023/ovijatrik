import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/actions/blog";
import ReactMarkdown from "react-markdown";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post || post.deletedAt || !post.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.titleBn}</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {post.readingTime ? `${post.readingTime} মিনিট পড়া` : ""}
        </p>

        {post.coverImage && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.titleBn}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-sm mt-8 max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
          <ReactMarkdown>{post.markdownBn}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
