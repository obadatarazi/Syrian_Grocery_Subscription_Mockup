import { useState } from "react";

import { OrderForm } from "@/features/orders/components/OrderForm";
import { useOrderMutations } from "@/features/orders/hooks/use-order-mutations";
import { ordersService } from "@/features/orders/services/orders.service";
import type { Order } from "@/features/orders/types/orders.types";
import { ConfirmDialog } from "@/shared/components";
import { CrudEntityDrawer, useCrudQuery } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type OrderFormDrawerProps = {
  open: boolean;
  mode: "create" | "edit";
  order?: Order | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void | Promise<void>;
};

export function OrderFormDrawer({
  open,
  mode,
  order,
  onOpenChange,
  onSuccess,
}: OrderFormDrawerProps) {
  const t = useTranslation();
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const { save, isSaving } = useOrderMutations({
    onSuccess: async () => {
      await onSuccess();
      setIsDirty(false);
      onOpenChange(false);
    },
  });

  // List rows are slim (no items/address). Edit must load Details via getById.
  const { data: orderDetail, isLoading: isOrderLoading } = useCrudQuery({
    queryKey: ["orders", "detail", String(order?.id ?? "")],
    queryFn: () => ordersService.getById(order!.id),
    enabled: open && mode === "edit" && Boolean(order?.id),
  });

  const resolvedOrder = mode === "edit" ? (orderDetail ?? order) : order;

  const requestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
      return;
    }
    onOpenChange(false);
  };

  return (
    <>
      <CrudEntityDrawer
        open={open}
        formMode={mode}
        onOpenChange={(next) => (next ? onOpenChange(next) : requestClose())}
        title={mode === "create" ? t.addOrder : t.editOrder}
        size="xl"
        isLoading={isSaving || (mode === "edit" && isOrderLoading && !orderDetail)}
      >
        <OrderForm
          mode={mode}
          order={resolvedOrder}
          isLoading={isSaving}
          onCancel={requestClose}
          onDirtyChange={setIsDirty}
          onSubmit={async (data) => {
            const result = await save(mode, data, resolvedOrder ?? undefined);
            if (result === "skipped") {
              setIsDirty(false);
              onOpenChange(false);
            }
          }}
        />
      </CrudEntityDrawer>

      <ConfirmDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title={t.discardChangesTitle}
        description={t.discardChangesDescription}
        confirmLabel={t.discardChangesConfirm}
        cancelLabel={t.cancel}
        variant="destructive"
        onConfirm={() => {
          setShowDiscardConfirm(false);
          setIsDirty(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
