import { normalizeTranslationsFromApi } from "@/shared/lib/api/normalize-translations.utils";

export type BilingualTranslation = {
  title?: string | null;
  description?: string | null;
  slug?: string | null;
  benefits?: string | null;
  ingredients?: string | null;
  usageMethod?: string | null;
  warnings?: string | null;
};

export type BilingualTranslations = Partial<Record<"en" | "ar", BilingualTranslation>>;

function resolveBilingualTranslations(
  translations: BilingualTranslations | unknown | undefined,
): BilingualTranslations | undefined {
  if (!translations) return undefined;
  return normalizeTranslationsFromApi<BilingualTranslation>(translations) ?? (translations as BilingualTranslations);
}

export type BilingualTextValues = {
  en: string;
  ar: string;
};

export function getBilingualTitle(
  translations: BilingualTranslations | unknown | undefined,
  fallbackTitle?: string | null,
): BilingualTextValues {
  const resolved = resolveBilingualTranslations(translations);
  return {
    en: resolved?.en?.title?.trim() || fallbackTitle?.trim() || "",
    ar: resolved?.ar?.title?.trim() || "",
  };
}

export function getBilingualDescription(
  translations: BilingualTranslations | unknown | undefined,
  fallbackDescription?: string | null,
): BilingualTextValues {
  const resolved = resolveBilingualTranslations(translations);
  return {
    en: resolved?.en?.description?.trim() || fallbackDescription?.trim() || "",
    ar: resolved?.ar?.description?.trim() || "",
  };
}

export function formatBilingualLabel(values: BilingualTextValues): string {
  const parts = [values.en, values.ar].filter(Boolean);
  return parts.join(" / ");
}
