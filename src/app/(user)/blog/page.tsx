import Link from "next/link";
import { getBlogPosts } from "@/actions/blog";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">ব্লগ</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          আমাদের কাজ, অভিজ্ঞতা এবং গল্পগুলো পড়ুন।
        </p>

        <div className="mt-8 space-y-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"
            >
              <h2 className="text-base font-semibold">{post.titleBn}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {post.markdownBn.slice(0, 160)}...
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {post.readingTime ? `${post.readingTime} মিনিট পড়া` : ""}
              </p>
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground">এখনও কোনো ব্লগ পোস্ট প্রকাশিত হয়নি।</p>
          )}
        </div>
      </section>
    </main>
  );
}
