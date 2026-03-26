import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  deleteWeeklyProjectPermanently,
  duplicateWeeklyProject,
  softDeleteWeeklyProject,
} from "@/actions/weekly-project";
import { ProjectStatus } from "@/generated/prisma/enums";

const statusClass: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "secondary",
};

export default async function WeeklyProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const status = (params.status || "").trim();
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 10;

  const where = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { titleBn: { contains: q, mode: "insensitive" as const } },
            { titleEn: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)
      ? { status: status as ProjectStatus }
      : {}),
  };

  const [projects, totalCount] = await Promise.all([
    prisma.weeklyProject.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        donations: {
          where: { deletedAt: null },
          select: { amount: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.weeklyProject.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (status) qp.set("status", status);
    qp.set("page", String(targetPage));
    return `/admin/weekly-projects?${qp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Weekly Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage published, draft, and archived weekly drives.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/weekly-projects/new">New Project</Link>
        </Button>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 md:grid-cols-[1fr_200px_auto]"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by title or slug"
          className="rounded-md border border-input px-3 py-2"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-input px-3 py-2"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
        <Button type="submit" className="w-full sm:w-auto">
          Apply
        </Button>
      </form>

      <div className="grid gap-4">
        {projects.map((project) => {
          const collected = project.donations.reduce(
            (sum, item) => sum + item.amount,
            0,
          );
          return (
            <Card key={project.id}>
              <CardHeader className="flex flex-col items-start justify-between gap-3 space-y-0 sm:flex-row">
                <div>
                  <CardTitle className="text-lg">
                    {project.titleEn || project.titleBn}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    /{project.slug}
                  </p>
                </div>
                <Badge variant={statusClass[project.status] ?? "outline"}>
                  {project.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-6 text-sm">
                <p>
                  Target:{" "}
                  <span className="font-semibold">
                    {project.targetAmount.toLocaleString()} BDT
                  </span>
                </p>
                <p>
                  Current:{" "}
                  <span className="font-semibold">
                    {collected.toLocaleString()} BDT
                  </span>
                </p>
                <p>
                  Duration:{" "}
                  <span className="font-semibold">
                    {project.startDate
                      ? project.startDate.toLocaleDateString()
                      : "-"}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold">
                    {project.endDate
                      ? project.endDate.toLocaleDateString()
                      : "-"}
                  </span>
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/weekly-projects/${project.id}`}>
                    Edit
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await duplicateWeeklyProject(project.id);
                  }}
                >
                  <Button variant="outline" size="sm" type="submit">
                    Duplicate
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await softDeleteWeeklyProject(project.id);
                  }}
                >
                  <Button variant="destructive" size="sm" type="submit">
                    Archive
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteWeeklyProjectPermanently(project.id);
                  }}
                >
                  <Button variant="destructive" size="sm" type="submit">
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}

        {projects.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No weekly projects yet.
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          Page {page} of {totalPages} ({totalCount} items)
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" disabled={page <= 1}>
            <Link href={queryWithPage(prevPage)}>Previous</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            <Link href={queryWithPage(nextPage)}>Next</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
