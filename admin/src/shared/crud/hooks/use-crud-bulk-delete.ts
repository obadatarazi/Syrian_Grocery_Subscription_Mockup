import { useCallback, useState } from "react";

import { collectSettledBulkResults, type CrudBulkMutationResult } from "@/shared/crud/utils/bulk-mutation.utils";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";
import { notify } from "@/shared/lib/notifications";

type UseCrudBulkDeleteOptions<T extends { id: string | number }> = {
  deleteFn: (entity: T) => Promise<unknown>;
  onSuccess?: () => void | Promise<void>;
};

export function useCrudBulkDelete<T extends { id: string | number }>({
  deleteFn,
  onSuccess,
}: UseCrudBulkDeleteOptions<T>) {
  const t = useTranslation();
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const bulkDelete = useCallback(
    async (entities: T[]): Promise<CrudBulkMutationResult> => {
      if (entities.length === 0) {
        return { succeededIds: [], failedIds: [], errors: [] };
      }

      setIsBulkDeleting(true);
      const toastId = notify.loading(t.loadingMessage);

      try {
        const settled = await Promise.allSettled(entities.map((entity) => deleteFn(entity)));
        const result = collectSettledBulkResults(
          entities.map((entity) => entity.id),
          settled,
        );

        // Always refresh so successful deletes are not left as stale rows.
        await onSuccess?.();

        const successCount = result.succeededIds.length;
        const failCount = result.failedIds.length;

        if (failCount === 0) {
          notify.success(
            t.successMessage,
            t.crudBulkDeleteSuccess.replace("{count}", String(successCount)),
            { id: toastId },
          );
        } else if (successCount === 0) {
          const firstError = result.errors[0]?.error;
          notify.error(
            t.errorMessage,
            firstError
              ? resolveServiceErrorMessage(firstError, t)
              : t.crudBulkDeleteFailed.replace("{count}", String(failCount)),
            { id: toastId },
          );
        } else {
          notify.warning(
            t.errorMessage,
            t.crudBulkDeletePartial
              .replace("{successCount}", String(successCount))
              .replace("{failCount}", String(failCount)),
            { id: toastId },
          );
        }

        return result;
      } finally {
        setIsBulkDeleting(false);
      }
    },
    [deleteFn, onSuccess, t],
  );

  return {
    bulkDelete,
    isBulkDeleting,
  };
}
