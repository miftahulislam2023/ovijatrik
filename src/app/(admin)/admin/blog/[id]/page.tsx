import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await prisma.blogPost.findFirst({ where: { id, deletedAt: null } });

    if (!post) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit: {post.titleEn || post.titleBn}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Markdown editor will be added next.</CardContent>
        </Card>
    );
}
