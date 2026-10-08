import { type ReactNode, useEffect, useState } from "react";

import { OrderCustomerPicker } from "@/features/orders/components/OrderCustomerPicker";
import { OrderDeliveryZonePicker } from "@/features/orders/components/OrderDeliveryZonePicker";
import { OrderLineItemFields } from "@/features/orders/components/OrderLineItemFields";
import type { Order, OrderFormData } from "@/features/orders/types/orders.types";
import {
  createEmptyOrderForm,
  orderToFormData,
} from "@/features/orders/types/orders.types";
import type { AdminUser } from "@/features/users/types/users.types";
import { SelectField, TextField } from "@/shared/components";
import { CrudFormFooter, CrudFormShell } from "@/shared/crud";
import { useOrderStatusOptions } from "@/shared/hooks/use-options";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type OrderFormProps = {
  mode: "create" | "edit";
  order?: Order | null;
  isLoading?: boolean;
  onSubmit: (data: OrderFormData) => void | Promise<void>;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-muted/15 p-4 sm:p-5">
      <div className="space-y-1 border-b border-border/60 pb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function OrderForm({
  mode,
  order,
  isLoading = false,
  onSubmit,
  onCancel,
  onDirtyChange,
}: OrderFormProps) {
  const t = useTranslation();
  const { options: statusOptions } = useOrderStatusOptions();
  const [form, setForm] = useState<OrderFormData>(createEmptyOrderForm());
  const [zoneError, setZoneError] = useState<string>();
  const [itemsError, setItemsError] = useState<string>();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(order ? orderToFormData(order) : createEmptyOrderForm());
    setZoneError(undefined);
    setItemsError(undefined);
    setIsDirty(false);
  }, [order, mode]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const updateForm = (updater: (current: OrderFormData) => OrderFormData) => {
    setForm(updater);
    setIsDirty(true);
  };

  const handleSelectCustomer = (user: AdminUser) => {
    updateForm((current) => ({
      ...current,
      userId: user.id,
      fullName: user.fullName || current.fullName,
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    }));
  };

  const handleClearCustomer = () => {
    updateForm((current) => ({
      ...current,
      userId: null,
    }));
  };

  const handleManualCustomerChange = (
    field: "fullName" | "email" | "phoneNumber",
    value: string,
  ) => {
    updateForm((current) => ({
      ...current,
      // Manual edits unlink the saved customer so guest/new details are submitted.
      userId: null,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasError = false;

    if (!form.deliveryZonePriceId) {
      setZoneError(t.required);
      hasError = true;
    } else {
      setZoneError(undefined);
    }

    const validItems = form.items.filter((item) => item.productId || item.productVariantId);
    if (mode === "create" && validItems.length === 0) {
      setItemsError(t.required);
      hasError = true;
    } else {
      setItemsError(undefined);
    }

    if (hasError) return;
    void onSubmit(form);
  };

  return (
    <CrudFormShell onSubmit={handleSubmit} className="space-y-5">
      {mode === "edit" ? (
        <FormSection title={t.orderStatus} description={t.orderStatusSectionHint}>
          <SelectField
            label={t.status}
            value={form.status ?? ""}
            onValueChange={(value) => updateForm((current) => ({ ...current, status: value }))}
            options={statusOptions}
            placeholder={t.selectStatus}
          />
        </FormSection>
      ) : null}

      <FormSection title={t.orderItems} description={t.orderItemsSectionHint}>
        {mode === "edit" ? (
          <p className="text-xs text-amber-700 dark:text-amber-400">{t.orderItemsReplaceHint}</p>
        ) : null}
        <OrderLineItemFields
          items={form.items}
          onChange={(items) => updateForm((current) => ({ ...current, items }))}
          error={itemsError}
        />
      </FormSection>

      <FormSection title={t.orderCustomer} description={t.orderCustomerSectionHint}>
        <OrderCustomerPicker
          value={form.userId}
          onSelect={handleSelectCustomer}
          onClear={handleClearCustomer}
          disabled={isLoading}
        />

        <div className="space-y-3 border-t border-border/60 pt-4">
          <p className="text-xs font-medium text-muted-foreground">{t.orderCustomerDetailsHeading}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label={t.fullName}
              value={form.fullName}
              onChange={(event) => handleManualCustomerChange("fullName", event.target.value)}
              placeholder={t.orderCustomerManualPlaceholder}
            />
            <TextField
              label={t.email}
              type="email"
              value={form.email}
              onChange={(event) => handleManualCustomerChange("email", event.target.value)}
            />
            <TextField
              label={t.phone}
              value={form.phoneNumber}
              onChange={(event) => handleManualCustomerChange("phoneNumber", event.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title={t.orderDelivery} description={t.orderDeliverySectionHint}>
        <OrderDeliveryZonePicker
          value={form.deliveryZonePriceId}
          onSelect={(zone) =>
            updateForm((current) => ({
              ...current,
              deliveryZonePriceId: zone.id,
            }))
          }
          onClear={() =>
            updateForm((current) => ({
              ...current,
              deliveryZonePriceId: null,
            }))
          }
          disabled={isLoading}
          error={zoneError}
          required
        />

        <div className="space-y-3 border-t border-border/60 pt-4">
          <p className="text-xs font-medium text-muted-foreground">{t.orderShippingAddressHeading}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label={t.addressTitle}
              value={form.addressTitle}
              onChange={(event) =>
                updateForm((current) => ({ ...current, addressTitle: event.target.value }))
              }
            />
            <TextField
              label={t.addressPhone}
              value={form.addressPhoneNumber}
              onChange={(event) =>
                updateForm((current) => ({
                  ...current,
                  addressPhoneNumber: event.target.value,
                }))
              }
            />
            <TextField
              label={t.street}
              value={form.addressStreetTitle}
              onChange={(event) =>
                updateForm((current) => ({
                  ...current,
                  addressStreetTitle: event.target.value,
                }))
              }
            />
            <TextField
              label={t.building}
              value={form.addressBuilding}
              onChange={(event) =>
                updateForm((current) => ({ ...current, addressBuilding: event.target.value }))
              }
            />
            <TextField
              label={t.floor}
              value={form.addressFloorNumber}
              onChange={(event) =>
                updateForm((current) => ({
                  ...current,
                  addressFloorNumber: event.target.value,
                }))
              }
            />
            <TextField
              label={t.apartment}
              value={form.addressApartment}
              onChange={(event) =>
                updateForm((current) => ({ ...current, addressApartment: event.target.value }))
              }
            />
            <TextField
              label={t.landmark}
              value={form.addressLandmark}
              onChange={(event) =>
                updateForm((current) => ({ ...current, addressLandmark: event.target.value }))
              }
            />
          </div>
        </div>
      </FormSection>

      <CrudFormFooter
        submitLabel={mode === "create" ? t.addOrder : t.save}
        cancelLabel={t.cancel}
        onCancel={onCancel}
        isLoading={isLoading}
        loadingLabel={t.loadingMessage}
      />
    </CrudFormShell>
  );
}
