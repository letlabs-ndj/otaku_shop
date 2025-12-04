"use client"

import { useI18n } from "@/lib/i18n-context"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-0.5">
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300",
          locale === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("fr")}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300",
          locale === "fr"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        FR
      </button>
    </div>
  )
}
