// ═══════════════════════════════════════════════════════════════════════════════
// LOCALIZATION CONTEXT
// Manages language switching and RTL/LTR layout
// ═══════════════════════════════════════════════════════════════════════════════

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { ar } from "../locales/ar";
import type { Translation } from "../locales/en";
import { en } from "../locales/en";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LocalizationContextType {
  language: Language;
  direction: Direction;
  t: Translation;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Translation> = {
  en,
  ar,
};

interface LocalizationProviderProps {
  children: ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("aroma-language");
    const initial: Language = stored === "ar" || stored === "en" ? stored : "ar";
    // Apply dir/lang during the first render so RTL paints correctly (no LTR flash).
    if (typeof document !== "undefined") {
      document.documentElement.dir = initial === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = initial;
    }
    return initial;
  });

  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const t = translations[language];

  // Keep document direction and language in sync when language changes
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    localStorage.setItem("aroma-language", language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    // Persist immediately so API calls (X-Locale) pick up the new locale
    // before the useEffect above runs.
    localStorage.setItem("aroma-language", lang);
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === "en" ? "ar" : "en";
      localStorage.setItem("aroma-language", next);
      return next;
    });
  };

  return (
    <LocalizationContext.Provider
      value={{
        language,
        direction,
        t,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

// Custom hook to use localization
export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
}

// Helper hook for quick access to translations
export function useTranslation() {
  const { t } = useLocalization();
  return t;
}
