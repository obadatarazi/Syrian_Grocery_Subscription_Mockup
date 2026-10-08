import { AppButton, FormActions } from "@/shared/components";
import { cn } from "@/shared/design-system/components/ui/utils";

type CrudFormFooterProps = {
  submitLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  isLoading?: boolean;
  loadingLabel?: string;
  submitDisabled?: boolean;
  sticky?: boolean;
  dataGuidance?: string;
};

export function CrudFormFooter({
  submitLabel,
  cancelLabel,
  onCancel,
  isLoading = false,
  loadingLabel,
  submitDisabled = false,
  sticky = true,
  dataGuidance = "crud-form-actions",
}: CrudFormFooterProps) {
  return (
    <FormActions
      data-guidance={dataGuidance}
      className={cn(
        "gap-3 sm:flex-row sm:flex-nowrap sm:justify-end",
        sticky
          ? "sticky bottom-0 mt-6 border-t border-border/50 bg-card/95 py-4 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80 [&_button]:w-full sm:[&_button]:w-auto sm:[&_button]:min-w-[6.5rem]"
          : "mt-5 [&_button]:w-full sm:[&_button]:w-auto sm:[&_button]:min-w-[6.5rem]",
      )}
    >
      <AppButton type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
        {cancelLabel}
      </AppButton>
      <AppButton
        type="submit"
        isLoading={isLoading}
        loadingText={loadingLabel}
        disabled={submitDisabled}
      >
        {submitLabel}
      </AppButton>
    </FormActions>
  );
}
