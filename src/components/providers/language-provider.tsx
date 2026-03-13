"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Language = "en" | "bn"

type LanguageContextValue = {
    language: Language
    setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = "ovijatrik-language"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window === "undefined") {
            return "en"
        }
        const stored = window.localStorage.getItem(STORAGE_KEY)
        return stored === "bn" ? "bn" : "en"
    })

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, language)
        document.documentElement.lang = language
        document.cookie = `ovijatrik-language=${language}; path=/; max-age=31536000`
    }, [language])

    const value = useMemo(
        () => ({
            language,
            setLanguage: setLanguageState,
        }),
        [language]
    )

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider")
    }
    return context
}
