import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markMessageAsRead, softDeleteMessage } from "@/actions/contact";
import { redirect } from "next/navigation";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <Card>
      <CardHeader>
        <CardTitle>{message.subject || "No Subject"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>Name: {message.name}</p>
        <p>Email: {message.email}</p>
        <p>Phone: {message.phone || "-"}</p>
        <p>Read: {message.readAt ? "Yes" : "No"}</p>
        <p className="rounded-md border border-border p-3">{message.body}</p>
        <div className="flex flex-wrap gap-3">
          {!message.readAt && (
            <form action={markReadAction}>
              <Button type="submit" variant="outline">
                Mark as Read
              </Button>
            </form>
          )}
          <form action={deleteAction}>
            <Button type="submit" variant="destructive">
              Archive Message
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
