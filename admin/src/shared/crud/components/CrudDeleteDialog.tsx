import { ConfirmDialog } from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type CrudDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export function CrudDeleteDialog({
  open,
  onOpenChange,
  entityLabel,
  onConfirm,
  isLoading = false,
}: CrudDeleteDialogProps) {
  const t = useTranslation();

  const title = entityLabel ? `${t.delete} ${entityLabel}` : t.crudDeleteTitle;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={t.crudDeleteConfirmDescription}
      confirmLabel={t.delete}
      cancelLabel={t.cancel}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
