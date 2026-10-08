import {
  hasFormChanges,
  normalizedStringEqual,
  pickChangedScalar,
} from "@/shared/lib/form/pick-changed-fields";
import type { LocaleCode } from "@/shared/lib/api/form-data.utils";
import type { PaginatedResult } from "@/shared/types";

export type SliderTranslation = {
  badge?: string | null;
  title: string;
  description?: string | null;
  buttonText?: string | null;
};

export type Slider = {
  id: number;
  badge?: string | null;
  title: string;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  buttonColorCode?: string | null;
  backgroundColorCode?: string | null;
  publish: boolean;
  imageFileUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  translations?: Partial<Record<LocaleCode, SliderTranslation>>;
};

export type SliderListParams = {
  page?: number;
  limit?: number;
  search?: string;
  publish?: boolean;
  sort?: string;
  direction?: "asc" | "desc";
};

export type SliderTranslationsInput = Partial<Record<LocaleCode, SliderTranslation>>;

export type SliderFormData = {
  translations: SliderTranslationsInput;
  publish?: boolean;
  image?: File | null;
  buttonLink?: string;
  buttonColorCode?: string;
  backgroundColorCode?: string;
};

export type SliderListResult = PaginatedResult<Slider>;

export function createEmptySliderForm(): SliderFormData {
  return {
    translations: {
      en: { badge: "", title: "", description: "", buttonText: "" },
      ar: { badge: "", title: "", description: "", buttonText: "" },
    },
    publish: true,
    image: null,
    buttonLink: "",
    buttonColorCode: "",
    backgroundColorCode: "",
  };
}

export function sliderToFormData(slider: Slider): SliderFormData {
  return {
    translations: {
      en: {
        badge: slider.translations?.en?.badge ?? slider.badge ?? "",
        title: slider.translations?.en?.title ?? slider.title,
        description: slider.translations?.en?.description ?? slider.description ?? "",
        buttonText: slider.translations?.en?.buttonText ?? slider.buttonText ?? "",
      },
      ar: {
        badge: slider.translations?.ar?.badge ?? "",
        title: slider.translations?.ar?.title ?? "",
        description: slider.translations?.ar?.description ?? "",
        buttonText: slider.translations?.ar?.buttonText ?? "",
      },
    },
    publish: slider.publish,
    image: null,
    buttonLink: slider.buttonLink ?? "",
    buttonColorCode: slider.buttonColorCode ?? "",
    backgroundColorCode: slider.backgroundColorCode ?? "",
  };
}

function pickChangedSliderTranslations(
  original: SliderTranslationsInput,
  current: SliderTranslationsInput,
): SliderTranslationsInput | undefined {
  const locales = new Set([...Object.keys(original), ...Object.keys(current)]) as Set<LocaleCode>;
  const changed: SliderTranslationsInput = {};
  let hasChanges = false;

  for (const locale of locales) {
    const originalTranslation = original[locale];
    const currentTranslation = current[locale];
    const fields = ["badge", "title", "description", "buttonText"] as const;
    const localeChanged = fields.some(
      (field) =>
        !normalizedStringEqual(originalTranslation?.[field], currentTranslation?.[field]),
    );

    if (!localeChanged) continue;

    hasChanges = true;
    changed[locale] = {
      badge: currentTranslation?.badge?.trim() ?? "",
      title: currentTranslation?.title?.trim() ?? "",
      description: currentTranslation?.description?.trim() ?? "",
      buttonText: currentTranslation?.buttonText?.trim() ?? "",
    };
  }

  return hasChanges ? changed : undefined;
}

export function pickSliderFormChanges(
  original: SliderFormData,
  current: SliderFormData,
): Partial<SliderFormData> {
  const changes: Partial<SliderFormData> = {
    ...pickChangedScalar(original, current, [
      "publish",
      "buttonLink",
      "buttonColorCode",
      "backgroundColorCode",
    ]),
  };

  const translationChanges = pickChangedSliderTranslations(original.translations, current.translations);
  if (translationChanges) {
    changes.translations = translationChanges;
  }

  if (current.image instanceof File) {
    changes.image = current.image;
  }

  return changes;
}

export function hasSliderFormChanges(original: SliderFormData, current: SliderFormData): boolean {
  return hasFormChanges(pickSliderFormChanges(original, current));
}
