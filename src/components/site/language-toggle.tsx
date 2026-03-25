"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"
import { useRouter } from "next/navigation"

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage()
    const router = useRouter()

    function handleToggle() {
        setLanguage(language === "en" ? "bn" : "en")
        // Most page content is server-rendered from cookie language.
        // Refresh makes the server read the latest cookie and re-render immediately.
        router.refresh()
    }

    return (
        <Button
            type="button"
            variant="outline"
            className="border-black/10 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 hover:bg-black/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            onClick={handleToggle}
            aria-label="Toggle language"
        >
            {language === "en" ? "EN" : "BN"}
        </Button>
    )
}
