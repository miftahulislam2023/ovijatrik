import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditTubewellProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.tubewellProject.findFirst({ where: { id, deletedAt: null } });

    if (!project) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit: {project.titleEn || project.titleBn}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Full edit form will be added next. Project location: {project.location}
            </CardContent>
        </Card>
    );
}
