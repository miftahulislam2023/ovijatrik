import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBlogPostPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Markdown create form with BN/EN fields and SEO metadata will be added next.
            </CardContent>
        </Card>
    );
}
