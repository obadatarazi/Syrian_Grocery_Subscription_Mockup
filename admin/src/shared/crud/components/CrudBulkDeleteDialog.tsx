import { ConfirmDialog } from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type CrudBulkDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
};

export function CrudBulkDeleteDialog({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
  isLoading = false,
}: CrudBulkDeleteDialogProps) {
  const t = useTranslation();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.crudBulkDeleteTitle.replace("{count}", String(selectedCount))}
      description={t.crudBulkDeleteConfirmDescription}
      confirmLabel={t.delete}
      cancelLabel={t.cancel}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
