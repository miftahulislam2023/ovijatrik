import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/authorization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function CreateAdminPage() {
  const userCount = await prisma.user.count();
  const isBootstrap = userCount === 0;
  const session = await auth();

  if (!isBootstrap && !isAdminRole(session?.user?.role)) {
    redirect("/join-us");
  }

  async function createAdminAction(formData: FormData) {
    "use server";

    const currentUserCount = await prisma.user.count();
    const bootstrapMode = currentUserCount === 0;
    const requester = await auth();

    if (!bootstrapMode && !isAdminRole(requester?.user?.role)) {
      throw new Error("Unauthorized");
    }

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const setupToken = String(formData.get("setupToken") || "").trim();
    const requiredSetupToken = process.env.ADMIN_SETUP_TOKEN?.trim();

    if (bootstrapMode && requiredSetupToken && setupToken !== requiredSetupToken) {
      throw new Error("Invalid setup token");
    }

    if (!name || !email || password.length < 6) {
      throw new Error("Name, email, and password (min 6 chars) are required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("An admin with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    redirect(bootstrapMode ? "/join-us" : "/admin/dashboard");
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{isBootstrap ? "Create Initial Admin" : "Create Admin Account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAdminAction} className="space-y-4">
            <input name="name" placeholder="Admin name" className="w-full rounded-md border border-input px-3 py-2" required />
            <input name="email" type="email" placeholder="admin@example.com" className="w-full rounded-md border border-input px-3 py-2" required />
            <input name="password" type="password" placeholder="Password" className="w-full rounded-md border border-input px-3 py-2" required minLength={6} />
            {isBootstrap && process.env.ADMIN_SETUP_TOKEN && (
              <input
                name="setupToken"
                type="password"
                placeholder="Setup token"
                className="w-full rounded-md border border-input px-3 py-2"
                required
              />
            )}
            <Button type="submit">Create Admin</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}