import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewWeeklyProjectPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Weekly Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Structured create form with Cloudinary upload and validation is the next implementation step.</p>
                <Link href="/admin/weekly-projects" className="text-primary underline">
                    Back to weekly projects
                </Link>
            </CardContent>
        </Card>
    );
}
