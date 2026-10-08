import { useEffect, useState } from "react";

import { SliderTranslationFields } from "@/features/sliders/components/SliderTranslationFields";
import type { Slider, SliderFormData } from "@/features/sliders/types/sliders.types";
import {
  createEmptySliderForm,
  sliderToFormData,
} from "@/features/sliders/types/sliders.types";
import { MediaImage, MediaVideo, TextField, ToggleField } from "@/shared/components";
import { CrudFileUpload, CrudFormFooter, CrudFormShell } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type SliderFormProps = {
  mode: "create" | "edit";
  slider?: Slider | null;
  isLoading?: boolean;
  onSubmit: (data: SliderFormData) => void | Promise<void>;
  onCancel: () => void;
};

export function SliderForm({
  mode,
  slider,
  isLoading = false,
  onSubmit,
  onCancel,
}: SliderFormProps) {
  const t = useTranslation();
  const [form, setForm] = useState<SliderFormData>(createEmptySliderForm());
  const [titleErrors, setTitleErrors] = useState<Partial<Record<"en" | "ar", string>>>({});

  useEffect(() => {
    setForm(slider ? sliderToFormData(slider) : createEmptySliderForm());
    setTitleErrors({});
  }, [slider, mode]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<"en" | "ar", string>> = {};
    if (!form.translations.en?.title?.trim() && !form.translations.ar?.title?.trim()) {
      nextErrors.en = t.required;
    }
    setTitleErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    void onSubmit(form);
  };

  return (
    <CrudFormShell onSubmit={handleSubmit}>
      <SliderTranslationFields
        value={form.translations}
        onChange={(translations) => setForm((current) => ({ ...current, translations }))}
        titleErrors={titleErrors}
        layout="tabs"
        autoFocusFirstField
      />

      <TextField
        label={t.buttonLink}
        value={form.buttonLink ?? ""}
        onChange={(event) => setForm((current) => ({ ...current, buttonLink: event.target.value }))}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t.buttonColor}
          value={form.buttonColorCode ?? ""}
          onChange={(event) =>
            setForm((current) => ({ ...current, buttonColorCode: event.target.value }))
          }
          placeholder="#0b7a6e"
        />
        <TextField
          label={t.backgroundColor}
          value={form.backgroundColorCode ?? ""}
          onChange={(event) =>
            setForm((current) => ({ ...current, backgroundColorCode: event.target.value }))
          }
          placeholder="#f0fdf4"
        />
      </div>

      <ToggleField
        label={t.publish}
        checked={form.publish ?? true}
        onCheckedChange={(checked) => setForm((current) => ({ ...current, publish: checked }))}
      />

      <CrudFileUpload
        label={t.sliderMedia}
        accept="image/*,video/mp4,video/*"
        value={form.image ?? null}
        onFileSelect={(file) => setForm((current) => ({ ...current, image: file }))}
      />
      {slider?.imageFileUrl && !form.image ? (
        <div className="overflow-hidden rounded-lg border border-border">
          {slider.imageFileUrl.endsWith(".mp4") ? (
            <MediaVideo
              src={slider.imageFileUrl}
              controls
              className="max-h-40 w-full object-cover"
            />
          ) : (
            <MediaImage
              src={slider.imageFileUrl}
              alt=""
              className="max-h-40 w-full object-cover"
            />
          )}
        </div>
      ) : null}

      <CrudFormFooter
        submitLabel={mode === "create" ? t.addSlider : t.save}
        cancelLabel={t.cancel}
        onCancel={onCancel}
        isLoading={isLoading}
        loadingLabel={t.loadingMessage}
      />
    </CrudFormShell>
  );
}
