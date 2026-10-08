import { SliderForm } from "@/features/sliders/components/SliderForm";
import { useSliderMutations } from "@/features/sliders/hooks/use-slider-mutations";
import type { Slider } from "@/features/sliders/types/sliders.types";
import { CrudEntityDrawer } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type SliderFormDrawerProps = {
  open: boolean;
  mode: "create" | "edit";
  slider?: Slider | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void | Promise<void>;
};

export function SliderFormDrawer({
  open,
  mode,
  slider,
  onOpenChange,
  onSuccess,
}: SliderFormDrawerProps) {
  const t = useTranslation();
  const { save, isSaving } = useSliderMutations({
    onSuccess: async () => {
      await onSuccess();
      onOpenChange(false);
    },
  });

  return (
    <CrudEntityDrawer
      open={open}
      formMode={mode}
      onOpenChange={onOpenChange}
      title={mode === "create" ? t.addSlider : t.editSlider}
      size="lg"
      isLoading={isSaving}
    >
      <SliderForm
        mode={mode}
        slider={slider}
        isLoading={isSaving}
        onCancel={() => onOpenChange(false)}
        onSubmit={async (data) => {
          const result = await save(mode, data, slider ?? undefined);
          if (result === "skipped") onOpenChange(false);
        }}
      />
    </CrudEntityDrawer>
  );
}
