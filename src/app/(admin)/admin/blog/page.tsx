import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminBlogPage() {
    const posts = await prisma.blogPost.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Blog Posts</h1>
                <Button asChild>
                    <Link href="/admin/blog/new">New Post</Link>
                </Button>
            </div>
            <div className="grid gap-4">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{post.titleEn || post.titleBn}</CardTitle>
                            <p className="text-xs text-muted-foreground">/{post.slug}</p>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between text-sm">
                            <p className="text-muted-foreground">{post.published ? "Published" : "Draft"}</p>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
