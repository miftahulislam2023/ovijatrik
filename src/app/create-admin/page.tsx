import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreateAdminPage() {
  async function createAdminAction(formData: FormData) {
    "use server";

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

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

    redirect("/join-us");
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAdminAction} className="space-y-4">
            <input name="name" placeholder="Admin name" className="w-full rounded-md border border-input px-3 py-2" required />
            <input name="email" type="email" placeholder="admin@example.com" className="w-full rounded-md border border-input px-3 py-2" required />
            <input name="password" type="password" placeholder="Password" className="w-full rounded-md border border-input px-3 py-2" required minLength={6} />
            <Button type="submit">Create Admin</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}