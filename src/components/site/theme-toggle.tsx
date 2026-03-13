"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const currentTheme = (theme === "system" ? resolvedTheme : theme) ?? "light"

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-black/10 text-slate-700 hover:bg-black/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    )
}
