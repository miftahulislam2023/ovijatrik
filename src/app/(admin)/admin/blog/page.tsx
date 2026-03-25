import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { duplicateBlogPost, softDeleteBlogPost } from "@/actions/blog";

export default async function AdminBlogPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; state?: string; featured?: string; page?: string }>;
}) {
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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Blog Posts</h1>
                <Button asChild>
                    <Link href="/admin/blog/new">New Post</Link>
                </Button>
            </div>

            <form className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_180px_180px_auto]" method="get">
                <input name="q" defaultValue={q} placeholder="Search title or slug" className="rounded-md border border-input px-3 py-2" />
                <select name="state" defaultValue={state} className="rounded-md border border-input px-3 py-2">
                    <option value="">All states</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
                <select name="featured" defaultValue={featured} className="rounded-md border border-input px-3 py-2">
                    <option value="">All featured states</option>
                    <option value="yes">Featured</option>
                    <option value="no">Not featured</option>
                </select>
                <Button type="submit">Apply</Button>
            </form>

            <div className="grid gap-4">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{post.titleEn || post.titleBn}</CardTitle>
                            <p className="text-xs text-muted-foreground">/{post.slug}</p>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between text-sm">
                            <p className="text-muted-foreground">{post.published ? "Published" : "Draft"}</p>
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                                </Button>
                                <form action={async () => {
                                    "use server";
                                    await duplicateBlogPost(post.id);
                                }}>
                                    <Button variant="outline" size="sm" type="submit">Duplicate</Button>
                                </form>
                                <form action={async () => {
                                    "use server";
                                    await softDeleteBlogPost(post.id);
                                }}>
                                    <Button variant="destructive" size="sm" type="submit">Archive</Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {posts.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            No blog posts found.
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
