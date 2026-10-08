import { useCallback } from "react";

import { ordersService } from "@/features/orders/services/orders.service";
import type { Order, OrderFormData } from "@/features/orders/types/orders.types";
import {
  hasOrderFormChanges,
  orderToFormData,
} from "@/features/orders/types/orders.types";
import { useCrudMutation, type CrudSaveResult } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type UseOrderMutationsOptions = {
  onSuccess?: () => void | Promise<void>;
};

export function useOrderMutations({ onSuccess }: UseOrderMutationsOptions = {}) {
  const t = useTranslation();

  const createMutation = useCrudMutation({
    mutationFn: (data: OrderFormData) => ordersService.create(data),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crudCreateSuccess,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess,
  });

  const updateMutation = useCrudMutation({
    mutationFn: ({
      id,
      data,
      original,
    }: {
      id: number;
      data: OrderFormData;
      original: OrderFormData;
    }) => ordersService.update(id, data, original),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crudUpdateSuccess,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess,
  });

  const statusMutation = useCrudMutation({
    mutationFn: ({
      id,
      data,
      original,
    }: {
      id: number;
      data: OrderFormData;
      original: OrderFormData;
    }) => ordersService.update(id, data, original),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.orderStatusUpdated,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess,
  });

  const save = useCallback(
    async (
      mode: "create" | "edit",
      data: OrderFormData,
      entity?: Order,
    ): Promise<CrudSaveResult | undefined> => {
      if (mode === "create") {
        await createMutation.mutate(data);
        return "saved";
      }
      if (!entity) return undefined;

      const original = orderToFormData(entity);
      if (!hasOrderFormChanges(original, data)) {
        return "skipped";
      }

      await updateMutation.mutate({ id: entity.id, data, original });
      return "saved";
    },
    [createMutation, updateMutation],
  );

  const quickUpdateStatus = useCallback(
    async (order: Order, status: string) => {
      if (!status || order.status?.value === status) return;
      const original = orderToFormData(order);
      await statusMutation.mutate({
        id: order.id,
        data: { ...original, status },
        original,
      });
    },
    [statusMutation],
  );

  return {
    createMutation,
    updateMutation,
    statusMutation,
    save,
    quickUpdateStatus,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isStatusUpdating: statusMutation.isPending,
  };
}
