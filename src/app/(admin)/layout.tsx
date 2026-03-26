import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { AdminSidebar, AdminHeader } from "@/components/site/admin-navbar";
import { getRequestLanguage } from "@/lib/language";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/authorization";
import { redirect } from "next/navigation";

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
    <div className="flex min-h-screen bg-[#f7f7f5] text-slate-900 dark:bg-[#0e1416] dark:text-white">
      {/* Desktop Sidebar */}
      <AdminSidebar language={language} />

      <div className="flex min-w-0 flex-1 flex-col">
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
