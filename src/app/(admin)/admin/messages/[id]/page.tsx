import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markMessageAsRead, softDeleteMessage } from "@/actions/contact";
import { redirect } from "next/navigation";
import { getRequestLanguage } from "@/lib/language";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        noSubject: "কোনো বিষয় নেই",
        name: "নাম",
        email: "ইমেইল",
        phone: "ফোন",
        read: "পঠিত",
        yes: "হ্যাঁ",
        no: "না",
        markRead: "পঠিত হিসেবে চিহ্নিত করুন",
        archive: "বার্তা আর্কাইভ করুন",
      }
    : {
        noSubject: "No Subject",
        name: "Name",
        email: "Email",
        phone: "Phone",
        read: "Read",
        yes: "Yes",
        no: "No",
        markRead: "Mark as Read",
        archive: "Archive Message",
      };

  const { id } = await params;
  const message = await prisma.message.findFirst({
    where: { id, deletedAt: null },
  });

  if (!message) {
    notFound();
  }

  async function markReadAction() {
    "use server";
    await markMessageAsRead(id);
    redirect(`/admin/messages/${id}`);
  }

  async function deleteAction() {
    "use server";
    await softDeleteMessage(id);
    redirect("/admin/messages");
  }

  return (
    <Card className="dark:border-white/10 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          {message.subject || copy.noSubject}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          {copy.name}: {message.name}
        </p>
        <p>
          {copy.email}: {message.email}
        </p>
        <p>
          {copy.phone}: {message.phone || "-"}
        </p>
        <p>
          {copy.read}: {message.readAt ? copy.yes : copy.no}
        </p>
        <p className="rounded-md border border-border p-3 dark:border-white/15 dark:bg-white/5">
          {message.body}
        </p>
        <div className="flex flex-wrap gap-3">
          {!message.readAt && (
            <form action={markReadAction}>
              <Button type="submit" variant="outline">
                {copy.markRead}
              </Button>
            </form>
          )}
          <form action={deleteAction}>
            <Button type="submit" variant="destructive">
              {copy.archive}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
