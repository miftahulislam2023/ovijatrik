import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminApplicationsPage() {
    const applications = await prisma.application.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Donation Applications</h1>
            <div className="grid gap-4">
                {applications.map((application) => (
                    <Link key={application.id} href={`/admin/applications/${application.id}`}>
                        <Card className="transition hover:border-primary">
                            <CardHeader>
                                <CardTitle className="text-base">{application.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {application.phone} - {application.status}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
