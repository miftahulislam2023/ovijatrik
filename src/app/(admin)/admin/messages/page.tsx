import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminMessagesPage() {
    const messages = await prisma.message.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Contact Messages</h1>
            <div className="grid gap-4">
                {messages.map((message) => (
                    <Link key={message.id} href={`/admin/messages/${message.id}`}>
                        <Card className="transition hover:border-primary">
                            <CardHeader>
                                <CardTitle className="text-base">{message.subject || "No Subject"}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {message.name} - {message.email}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
