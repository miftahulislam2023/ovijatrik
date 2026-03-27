"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useRouter } from "next/navigation";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  function handleToggle() {
    setLanguage(language === "en" ? "bn" : "en");
    // Most page content is server-rendered from cookie language.
    // Refresh makes the server read the latest cookie and re-render immediately.
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="border-border bg-background px-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-accent hover:text-accent-foreground"
      onClick={handleToggle}
      aria-label="Toggle language"
    >
      {language === "en" ? "EN" : "BN"}
    </Button>
  );
}
