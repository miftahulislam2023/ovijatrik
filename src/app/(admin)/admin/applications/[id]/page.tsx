import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const application = await prisma.application.findFirst({ where: { id, deletedAt: null } });

    if (!application) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{application.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Phone: {application.phone}</p>
                <p>Email: {application.email || "-"}</p>
                <p>Status: {application.status}</p>
                <p>Reason: {application.reason}</p>
                {application.details && <p>Details: {application.details}</p>}
            </CardContent>
        </Card>
    );
}
