// ═══════════════════════════════════════════════════════════════════════════════
// LANGUAGE SWITCHER COMPONENT
// Toggle between English and Arabic with RTL support
// ═══════════════════════════════════════════════════════════════════════════════

import { Globe } from "lucide-react";

import { useLocalization } from "../localization/contexts/LocalizationContext";

interface LanguageSwitcherProps {
  variant?: "header" | "minimal";
  showText?: boolean;
}

export function LanguageSwitcher({ variant = "header", showText = true }: LanguageSwitcherProps) {
  const { language, toggleLanguage } = useLocalization();

  if (variant === "minimal") {
    return (
      <button
        onClick={toggleLanguage}
        className="flex size-9 items-center justify-center rounded-xl border border-border text-xs font-black text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Switch language"
      >
        {language === "en" ? "ع" : "EN"}
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-teal-600 hover:bg-teal-50 transition-all duration-200"
      aria-label="Switch language"
    >
      <Globe className="w-5 h-5 text-teal-600" />
      {showText && (
        <span className="text-sm font-semibold text-gray-700">
          {language === "en" ? "العربية" : "English"}
        </span>
      )}
    </button>
  );
}
