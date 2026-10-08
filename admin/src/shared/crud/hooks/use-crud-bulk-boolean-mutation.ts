import { useCallback, useState } from "react";

import { collectSettledBulkResults, type CrudBulkMutationResult } from "@/shared/crud/utils/bulk-mutation.utils";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";
import { notify } from "@/shared/lib/notifications";

type UseCrudBulkBooleanMutationOptions = {
  updateFn: (id: string | number, data: Record<string, boolean>) => Promise<unknown>;
  onSuccess?: () => void | Promise<void>;
};

export function useCrudBulkBooleanMutation({
  updateFn,
  onSuccess,
}: UseCrudBulkBooleanMutationOptions) {
  const t = useTranslation();
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const bulkUpdate = useCallback(
    async (
      ids: Array<string | number>,
      field: string,
      value: boolean,
    ): Promise<CrudBulkMutationResult> => {
      if (ids.length === 0) {
        return { succeededIds: [], failedIds: [], errors: [] };
      }

      setIsBulkUpdating(true);
      const toastId = notify.loading(t.loadingMessage);

      try {
        const settled = await Promise.allSettled(ids.map((id) => updateFn(id, { [field]: value })));
        const result = collectSettledBulkResults(ids, settled);

        // Always refresh so successful updates are reflected and failures stay visible.
        await onSuccess?.();

        const successCount = result.succeededIds.length;
        const failCount = result.failedIds.length;

        if (failCount === 0) {
          notify.success(
            t.successMessage,
            t.crudBulkUpdateSuccess.replace("{count}", String(successCount)),
            { id: toastId },
          );
        } else if (successCount === 0) {
          const firstError = result.errors[0]?.error;
          notify.error(
            t.errorMessage,
            firstError
              ? resolveServiceErrorMessage(firstError, t)
              : t.crudBulkUpdateFailed.replace("{count}", String(failCount)),
            { id: toastId },
          );
        } else {
          notify.warning(
            t.errorMessage,
            t.crudBulkUpdatePartial
              .replace("{successCount}", String(successCount))
              .replace("{failCount}", String(failCount)),
            { id: toastId },
          );
        }

        return result;
      } finally {
        setIsBulkUpdating(false);
      }
    },
    [onSuccess, t, updateFn],
  );

  return {
    bulkUpdate,
    isBulkUpdating,
  };
}
