"use client";

import { ThemeProvider } from "next-themes";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/components/providers/language-provider";

export function AppProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
