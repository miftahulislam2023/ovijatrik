import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const message = await prisma.message.findFirst({ where: { id, deletedAt: null } });

    if (!message) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{message.subject || "No Subject"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Name: {message.name}</p>
                <p>Email: {message.email}</p>
                <p>Phone: {message.phone || "-"}</p>
                <p>{message.body}</p>
            </CardContent>
        </Card>
    );
}
