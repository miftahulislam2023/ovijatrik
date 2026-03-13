"use client"

import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "@/components/providers/language-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
    )
}
