import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markMessageAsRead, softDeleteMessage } from "@/actions/contact";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; read?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const read = (params.read || "").trim();
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 12;

  const where = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { subject: { contains: q, mode: "insensitive" as const } },
            { body: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(read === "read" ? { readAt: { not: null as Date | null } } : {}),
    ...(read === "unread" ? { readAt: null } : {}),
  };

  const [messages, totalCount] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.message.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (read) qp.set("read", read);
    qp.set("page", String(targetPage));
    return `/admin/messages?${qp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contact Messages</h1>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_auto]"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search sender, subject, message"
          className="rounded-md border border-input px-3 py-2"
        />
        <select
          name="read"
          defaultValue={read}
          className="rounded-md border border-input px-3 py-2"
        >
          <option value="">All</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
        <Button type="submit" className="w-full sm:w-auto">
          Apply
        </Button>
      </form>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id} className="transition hover:border-primary">
            <CardHeader>
              <CardTitle className="text-base">
                {message.subject || "No Subject"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                {message.name} - {message.email}{" "}
                {message.readAt ? "(Read)" : "(Unread)"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/messages/${message.id}`}>View</Link>
                </Button>
                {!message.readAt && (
                  <form
                    action={async () => {
                      "use server";
                      await markMessageAsRead(message.id);
                    }}
                  >
                    <Button type="submit" variant="outline" size="sm">
                      Mark Read
                    </Button>
                  </form>
                )}
                <form
                  action={async () => {
                    "use server";
                    await softDeleteMessage(message.id);
                  }}
                >
                  <Button type="submit" variant="destructive" size="sm">
                    Archive
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No messages found.
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
