import type { Slider } from "@/features/sliders/types/sliders.types";
import {
  getTitleFromApiTranslations,
  normalizeTranslationsFromApi,
} from "@/shared/lib/api";

export function mapSliderFromApi(slider: Slider): Slider {
  const translations = normalizeTranslationsFromApi<{
    badge?: string;
    title?: string;
    description?: string;
    buttonText?: string;
  }>(slider.translations);

  const en = translations?.en;

  return {
    ...slider,
    title: en?.title?.trim() || getTitleFromApiTranslations(slider.translations, slider.title ?? ""),
    badge: en?.badge?.trim() || slider.badge?.trim() || null,
    description: en?.description?.trim() || slider.description?.trim() || null,
    buttonText: en?.buttonText?.trim() || slider.buttonText?.trim() || null,
    ...(translations ? { translations: translations as Slider["translations"] } : {}),
  };
}
