"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage()

    return (
        <Button
            type="button"
            variant="outline"
            className="border-black/10 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 hover:bg-black/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            aria-label="Toggle language"
        >
            {language === "en" ? "EN" : "BN"}
        </Button>
    )
}
