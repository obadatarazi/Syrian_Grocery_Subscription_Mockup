import { useEffect, useState } from "react";

import type { SliderTranslationsInput } from "@/features/sliders/types/sliders.types";
import { TextAreaField, TextField } from "@/shared/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/design-system/components/ui/tabs";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type SliderTranslationFieldsProps = {
  value: SliderTranslationsInput;
  onChange: (value: SliderTranslationsInput) => void;
  titleErrors?: Partial<Record<"en" | "ar", string>>;
  /** "tabs" switches the stacked EN/AR fields into a tabbed view to cut down scroll height. */
  layout?: "stacked" | "tabs";
  /** Focuses the English title input as soon as the fields mount. */
  autoFocusFirstField?: boolean;
};

export function SliderTranslationFields({
  value,
  onChange,
  titleErrors,
  layout = "stacked",
  autoFocusFirstField = false,
}: SliderTranslationFieldsProps) {
  const t = useTranslation();
  const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");

  useEffect(() => {
    if (titleErrors?.en) setActiveLocale("en");
    else if (titleErrors?.ar) setActiveLocale("ar");
  }, [titleErrors]);

  const updateLocale = (
    locale: "en" | "ar",
    field: "badge" | "title" | "description" | "buttonText",
    next: string,
  ) => {
    onChange({
      ...value,
      [locale]: {
        badge: value[locale]?.badge ?? "",
        title: value[locale]?.title ?? "",
        description: value[locale]?.description ?? "",
        buttonText: value[locale]?.buttonText ?? "",
        [field]: next,
      },
    });
  };

  const englishFields = (
    <>
      <TextField
        label={t.badgeEnglish}
        value={value.en?.badge ?? ""}
        onChange={(event) => updateLocale("en", "badge", event.target.value)}
        autoFocus={autoFocusFirstField}
      />
      <TextField
        label={t.titleEnglish}
        value={value.en?.title ?? ""}
        onChange={(event) => updateLocale("en", "title", event.target.value)}
        error={titleErrors?.en}
        required
      />
      <TextAreaField
        label={t.descriptionEnglish}
        value={value.en?.description ?? ""}
        onChange={(event) => updateLocale("en", "description", event.target.value)}
        rows={3}
      />
      <TextField
        label={t.buttonTextEnglish}
        value={value.en?.buttonText ?? ""}
        onChange={(event) => updateLocale("en", "buttonText", event.target.value)}
      />
    </>
  );

  const arabicFields = (
    <>
      <TextField
        label={t.badgeArabic}
        value={value.ar?.badge ?? ""}
        onChange={(event) => updateLocale("ar", "badge", event.target.value)}
        dir="rtl"
      />
      <TextField
        label={t.titleArabic}
        value={value.ar?.title ?? ""}
        onChange={(event) => updateLocale("ar", "title", event.target.value)}
        error={titleErrors?.ar}
        dir="rtl"
      />
      <TextAreaField
        label={t.descriptionArabic}
        value={value.ar?.description ?? ""}
        onChange={(event) => updateLocale("ar", "description", event.target.value)}
        rows={3}
        dir="rtl"
      />
      <TextField
        label={t.buttonTextArabic}
        value={value.ar?.buttonText ?? ""}
        onChange={(event) => updateLocale("ar", "buttonText", event.target.value)}
        dir="rtl"
      />
    </>
  );

  if (layout === "tabs") {
    return (
      <Tabs value={activeLocale} onValueChange={(next) => setActiveLocale(next as "en" | "ar")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="en" className="gap-1.5">
            {t.tabEnglish}
            {titleErrors?.en ? (
              <span className="size-1.5 shrink-0 rounded-full bg-destructive" aria-hidden="true" />
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="ar" className="gap-1.5">
            {t.tabArabic}
            {titleErrors?.ar ? (
              <span className="size-1.5 shrink-0 rounded-full bg-destructive" aria-hidden="true" />
            ) : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-4 pt-4">
          {englishFields}
        </TabsContent>
        <TabsContent value="ar" className="space-y-4 pt-4">
          {arabicFields}
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <div className="space-y-4">
      {englishFields}
      {arabicFields}
    </div>
  );
}
