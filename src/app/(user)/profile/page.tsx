import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const language = await getRequestLanguage();
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/join-us");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });

  if (!user) {
    await signOut({ redirectTo: "/" });
  }

  const copy = {
    en: {
      title: "My Profile",
      subtitle: "Update your account information or delete your profile.",
      name: "Name",
      email: "Email",
      image: "Image URL",
      role: "Role",
      update: "Update Profile",
      deleteTitle: "Danger Zone",
      deleteHelp: "Deleting your profile is permanent and cannot be undone.",
      delete: "Delete Profile",
    },
    bn: {
      title: "আমার প্রোফাইল",
      subtitle: "আপনার তথ্য আপডেট করুন অথবা প্রোফাইল মুছে ফেলুন।",
      name: "নাম",
      email: "ইমেইল",
      image: "ছবির URL",
      role: "ভূমিকা",
      update: "প্রোফাইল আপডেট করুন",
      deleteTitle: "সতর্কতা",
      deleteHelp: "প্রোফাইল মুছে ফেললে তা আর ফেরত আনা যাবে না।",
      delete: "প্রোফাইল মুছে ফেলুন",
    },
  } as const;

  const content = copy[language];

  async function updateProfileAction(formData: FormData) {
    "use server";

    const currentSession = await auth();
    if (!currentSession?.user?.id) {
      redirect("/join-us");
    }

    const name = String(formData.get("name") || "").trim() || null;
    const emailRaw = String(formData.get("email") || "").trim().toLowerCase();
    const image = String(formData.get("image") || "").trim() || null;

    if (!emailRaw) {
      throw new Error("Email is required");
    }

    await prisma.user.update({
      where: { id: currentSession.user.id },
      data: {
        name,
        email: emailRaw,
        image,
      },
    });

    redirect("/profile");
  }

  async function deleteProfileAction() {
    "use server";

    const currentSession = await auth();
    if (!currentSession?.user?.id) {
      redirect("/join-us");
    }

    await prisma.user.delete({
      where: { id: currentSession.user.id },
    });

    await signOut({ redirectTo: "/" });
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-sm text-muted-foreground">{content.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {content.name}
              </label>
              <input
                id="name"
                name="name"
                defaultValue={user.name ?? ""}
                className="w-full rounded-md border border-input px-3 py-2"
                placeholder={content.name}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {content.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={user.email ?? ""}
                className="w-full rounded-md border border-input px-3 py-2"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                {content.image}
              </label>
              <input
                id="image"
                name="image"
                type="url"
                defaultValue={user.image ?? ""}
                className="w-full rounded-md border border-input px-3 py-2"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
              <span className="font-medium">{content.role}: </span>
              <span className="text-muted-foreground">{user.role}</span>
            </div>

            <Button type="submit">{content.update}</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 border-destructive/30">
        <CardHeader>
          <CardTitle>{content.deleteTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{content.deleteHelp}</p>
          <form action={deleteProfileAction}>
            <Button type="submit" variant="destructive">
              {content.delete}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
