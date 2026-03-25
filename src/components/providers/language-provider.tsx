"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "bn";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "ovijatrik-language";

function readCookieLanguage(): Language | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("ovijatrik-language="));

  if (!cookie) {
    return null;
  }

  const value = cookie.split("=").slice(1).join("=");
  return value === "bn" ? "bn" : value === "en" ? "en" : null;
}

function persistLanguage(language: Language) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore storage write failures (privacy mode, quota, etc.)
    }
  }

  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.cookie = `ovijatrik-language=${language}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const cookieLanguage = readCookieLanguage();
    if (cookieLanguage) {
      return cookieLanguage;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "bn" ? "bn" : "en";
  });

  useEffect(() => {
    // Ensure DOM + cookie are always aligned even on first mount.
    persistLanguage(language);
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    // Persist synchronously so `router.refresh()` (server render) sees the new cookie immediately.
    persistLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
