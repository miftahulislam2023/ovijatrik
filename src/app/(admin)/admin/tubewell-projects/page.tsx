import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function TubewellProjectsAdminPage() {
    const projects = await prisma.tubewellProject.findMany({
        where: { deletedAt: null },
        orderBy: [{ year: "desc" }, { completionDate: "desc" }],
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Tubewell Projects</h1>
                    <p className="text-sm text-muted-foreground">Archive of completed clean-water initiatives.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/tubewell-projects/new">New Project</Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{project.titleEn || project.titleBn}</CardTitle>
                            <p className="text-xs text-muted-foreground">/{project.slug}</p>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-center gap-6 text-sm">
                            <p>
                                Location: <span className="font-semibold">{project.location}</span>
                            </p>
                            <p>
                                Year: <span className="font-semibold">{project.year}</span>
                            </p>
                            <p>
                                Completed: <span className="font-semibold">{project.completionDate.toLocaleDateString()}</span>
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/tubewell-projects/${project.id}`}>Edit</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {projects.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            No tubewell projects yet.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
