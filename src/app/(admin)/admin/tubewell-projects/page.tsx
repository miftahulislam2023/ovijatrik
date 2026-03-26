import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  deleteTubewellProjectPermanently,
  duplicateTubewellProject,
  softDeleteTubewellProject,
} from "@/actions/tubewell-project";

export default async function TubewellProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; year?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const year = Number(params.year || "");
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
            { location: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(Number.isFinite(year) && year > 0 ? { year } : {}),
  };

  const [projects, totalCount] = await Promise.all([
    prisma.tubewellProject.findMany({
      where,
      orderBy: [{ year: "desc" }, { completionDate: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tubewellProject.count({ where }),
  ]);

  const years = await prisma.tubewellProject.findMany({
    where: { deletedAt: null },
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" },
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (params.year) qp.set("year", params.year);
    qp.set("page", String(targetPage));
    return `/admin/tubewell-projects?${qp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tubewell Projects</h1>
          <p className="text-sm text-muted-foreground">
            Archive of completed clean-water initiatives.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tubewell-projects/new">New Project</Link>
        </Button>
      </div>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_auto]"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title, slug, location"
          className="rounded-md border border-input px-3 py-2"
        />
        <select
          name="year"
          defaultValue={params.year || ""}
          className="rounded-md border border-input px-3 py-2"
        >
          <option value="">All years</option>
          {years.map((item) => (
            <option key={item.year} value={item.year}>
              {item.year}
            </option>
          ))}
        </select>
        <Button type="submit" className="w-full sm:w-auto">
          Apply
        </Button>
      </form>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {project.titleEn || project.titleBn}
              </CardTitle>
              <p className="text-xs text-muted-foreground">/{project.slug}</p>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-6 text-sm">
              <p>
                Location:{" "}
                <span className="font-semibold">{project.location}</span>
              </p>
              <p>
                Year: <span className="font-semibold">{project.year}</span>
              </p>
              <p>
                Completed:{" "}
                <span className="font-semibold">
                  {project.completionDate.toLocaleDateString()}
                </span>
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/tubewell-projects/${project.id}`}>
                  Edit
                </Link>
              </Button>
              <form
                action={async () => {
                  "use server";
                  await duplicateTubewellProject(project.id);
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Duplicate
                </Button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await softDeleteTubewellProject(project.id);
                }}
              >
                <Button variant="destructive" size="sm" type="submit">
                  Archive
                </Button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteTubewellProjectPermanently(project.id);
                }}
              >
                <Button variant="destructive" size="sm" type="submit">
                  Delete
                </Button>
              </form>
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
