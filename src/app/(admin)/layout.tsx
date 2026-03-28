import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { AdminSidebar, AdminHeader } from "@/components/site/admin-navbar";
import { getRequestLanguage } from "@/lib/language";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/authorization";
import { redirect } from "next/navigation";
import { Hind_Siliguri } from "next/font/google";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/join-us");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/");
  }

  const language = await getRequestLanguage();

  return (
    <div
      className={`flex min-h-screen overflow-x-hidden bg-background text-foreground ${language === "bn" ? hindSiliguri.className : ""}`}
    >
      {/* Desktop Sidebar */}
      <AdminSidebar language={language} />

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Unified Top Header & Mobile Nav */}
        <AdminHeader language={language}>
          {/* Passing the toggles as children preserves their state/server functionality */}
          <LanguageToggle />
          <ThemeToggle />
        </AdminHeader>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
