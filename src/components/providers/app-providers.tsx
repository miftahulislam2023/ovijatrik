"use client"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/components/providers/language-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <LanguageProvider>{children}</LanguageProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}
