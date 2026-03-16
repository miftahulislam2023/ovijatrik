import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewGalleryItemPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Gallery Item</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Cloudinary image uploader and ordering form will be added next.
            </CardContent>
        </Card>
    );
}
