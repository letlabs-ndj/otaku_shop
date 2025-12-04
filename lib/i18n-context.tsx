"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import en from "./translations/en.json"
import fr from "./translations/fr.json"

type Locale = "en" | "fr"
type Translations = typeof en

const translations: Record<Locale, Translations> = { en, fr }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    const savedLocale = localStorage.getItem("eno-locale") as Locale | null
    if (savedLocale && (savedLocale === "en" || savedLocale === "fr")) {
      setLocale(savedLocale)
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("eno-locale", newLocale)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
