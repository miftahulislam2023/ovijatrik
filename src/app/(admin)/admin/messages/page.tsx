import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  bulkMarkMessagesAsRead,
  bulkSoftDeleteMessages,
  markMessageAsRead,
  softDeleteMessage,
} from "@/actions/contact";
import { getRequestLanguage } from "@/lib/language";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; read?: string; page?: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "যোগাযোগ বার্তাসমূহ",
        search: "প্রেরক, বিষয়, বার্তা দিয়ে খুঁজুন",
        all: "সব",
        read: "পড়া",
        unread: "অপঠিত",
        apply: "প্রয়োগ করুন",
        noSubject: "কোনো বিষয় নেই",
        view: "দেখুন",
        markRead: "পঠিত করুন",
        archive: "আর্কাইভ",
        selectedActions: "নির্বাচিত বার্তার অ্যাকশন",
        markSelectedRead: "নির্বাচিত পঠিত করুন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        select: "নির্বাচন",
        noData: "কোনো বার্তা পাওয়া যায়নি।",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        title: "Contact Messages",
        search: "Search sender, subject, message",
        all: "All",
        read: "Read",
        unread: "Unread",
        apply: "Apply",
        noSubject: "No Subject",
        view: "View",
        markRead: "Mark Read",
        archive: "Archive",
        selectedActions: "Actions for selected messages",
        markSelectedRead: "Mark Selected Read",
        archiveSelected: "Archive Selected",
        select: "Select",
        noData: "No messages found.",
        page: "Page",
        of: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

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
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        {copy.title}
      </h1>

      <form
        className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_auto]"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder={copy.search}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        />
        <select
          name="read"
          defaultValue={read}
          className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">{copy.all}</option>
          <option value="read">{copy.read}</option>
          <option value="unread">{copy.unread}</option>
        </select>
        <Button type="submit" className="w-full sm:w-auto">
          {copy.apply}
        </Button>
      </form>

      <form
        id="messages-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkMarkMessagesAsRead}
          variant="outline"
          size="sm"
        >
          {copy.markSelectedRead}
        </Button>
        <Button
          type="submit"
          formAction={bulkSoftDeleteMessages}
          variant="destructive"
          size="sm"
        >
          {copy.archiveSelected}
        </Button>
      </form>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id} className="transition hover:border-primary">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">
                  {message.subject || copy.noSubject}
                </CardTitle>
                <label className="inline-flex items-center gap-2 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    name="ids"
                    value={message.id}
                    form="messages-bulk-actions"
                    className="h-4 w-4"
                  />
                  {copy.select}
                </label>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                {message.name} - {message.email}{" "}
                {message.readAt ? "(Read)" : "(Unread)"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/messages/${message.id}`}>
                    {copy.view}
                  </Link>
                </Button>
                {!message.readAt && (
                  <form
                    action={async () => {
                      "use server";
                      await markMessageAsRead(message.id);
                    }}
                  >
                    <Button type="submit" variant="outline" size="sm">
                      {copy.markRead}
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
                    {copy.archive}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              {copy.noData}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {copy.page} {page} {copy.of} {totalPages} ({totalCount} {copy.items})
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" disabled={page <= 1}>
            <Link href={queryWithPage(prevPage)}>{copy.previous}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            <Link href={queryWithPage(nextPage)}>{copy.next}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
