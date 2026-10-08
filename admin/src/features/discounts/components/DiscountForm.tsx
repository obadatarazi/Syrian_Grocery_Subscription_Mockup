import { type ReactNode, useEffect, useState } from "react";

import type { Discount, DiscountFormData } from "@/features/discounts/types/discounts.types";
import {
  createEmptyDiscountForm,
  discountToFormData,
} from "@/features/discounts/types/discounts.types";
import { SelectField, TextAreaField, TextField, ToggleField } from "@/shared/components";
import { CrudFormFooter, CrudFormShell } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { env } from "@/shared/lib/env";

type DiscountFormProps = {
  mode: "create" | "edit";
  discount?: Discount | null;
  isLoading?: boolean;
  onSubmit: (data: DiscountFormData) => void | Promise<void>;
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
    <section className="space-y-4 rounded-xl border border-border bg-muted/15 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function DiscountForm({
  mode,
  discount,
  isLoading = false,
  onSubmit,
  onCancel,
  onDirtyChange,
}: DiscountFormProps) {
  const t = useTranslation();
  const [form, setForm] = useState<DiscountFormData>(createEmptyDiscountForm());
  const [errors, setErrors] = useState<Partial<Record<"code" | "titleEn", string>>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(discount ? discountToFormData(discount) : createEmptyDiscountForm());
    setErrors({});
    setIsDirty(false);
  }, [discount, mode]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const update = (patch: Partial<DiscountFormData>) => {
    setForm((current) => ({ ...current, ...patch }));
    setIsDirty(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!form.code.trim()) next.code = t.required;
    if (!form.titleEn.trim()) next.titleEn = t.required;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    void onSubmit(form);
  };

  return (
    <CrudFormShell onSubmit={handleSubmit} className="space-y-4">
      <FormSection title={t.discountSectionContent} description={t.discountSectionContentHint}>
        <TextField
          label={t.discountCode}
          required
          error={errors.code}
          value={form.code}
          onChange={(event) => update({ code: event.target.value.toUpperCase() })}
          className="font-mono uppercase"
          placeholder="AROMA10"
          autoFocus={mode === "create"}
          autoComplete="off"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t.discountTitleEn}
            required
            error={errors.titleEn}
            value={form.titleEn}
            onChange={(event) => update({ titleEn: event.target.value })}
          />
          <TextField
            label={t.discountTitleAr}
            value={form.titleAr}
            onChange={(event) => update({ titleAr: event.target.value })}
            dir="rtl"
          />
        </div>
        <TextAreaField
          label={t.discountDescEn}
          value={form.descEn}
          onChange={(event) => update({ descEn: event.target.value })}
        />
        <TextAreaField
          label={t.discountDescAr}
          value={form.descAr}
          onChange={(event) => update({ descAr: event.target.value })}
          dir="rtl"
        />
      </FormSection>

      <FormSection title={t.discountSectionValue} description={t.discountSectionValueHint}>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label={t.discountType}
            value={form.type}
            onValueChange={(value) =>
              update({
                type: value as DiscountFormData["type"],
                value: value === "FREE_SHIPPING" ? 0 : form.value || 10,
              })
            }
            options={[
              { value: "PERCENTAGE", label: t.discountTypePercentage },
              { value: "FIXED", label: t.discountTypeFixed },
              { value: "FREE_SHIPPING", label: t.discountTypeFreeShipping },
            ]}
          />
          <TextField
            label={t.discountValue}
            type="number"
            min={0}
            step="0.001"
            disabled={form.type === "FREE_SHIPPING"}
            value={form.type === "FREE_SHIPPING" ? "" : String(form.value)}
            onChange={(event) =>
              update({ value: event.target.value === "" ? 0 : Number(event.target.value) })
            }
            helperText={
              form.type === "PERCENTAGE"
                ? "%"
                : form.type === "FIXED"
                  ? form.currencyCode
                  : "—"
            }
          />
          <TextField
            label={t.discountCurrencyCode}
            value={form.currencyCode}
            onChange={(event) => update({ currencyCode: event.target.value.toUpperCase() })}
            className="uppercase"
          />
        </div>
      </FormSection>

      <FormSection title={t.discountSectionScope} description={t.discountSectionScopeHint}>
        <SelectField
          label={t.discountScope}
          value={form.scope}
          onValueChange={(value) => update({ scope: value as DiscountFormData["scope"] })}
          options={[
            { value: "CART", label: "CART" },
            { value: "PRODUCT", label: "PRODUCT" },
            { value: "CATEGORY", label: "CATEGORY" },
            { value: "BRAND", label: "BRAND" },
            { value: "TAG", label: "TAG" },
          ]}
        />
        {form.scope === "PRODUCT" ? (
          <TextField
            label={t.discountProductIds}
            value={form.productIdsText}
            onChange={(event) => update({ productIdsText: event.target.value })}
            helperText={t.discountProductIdsHint}
            placeholder="1, 2"
          />
        ) : null}
        {form.scope === "CATEGORY" ? (
          <TextField
            label={t.discountCategories}
            value={form.categoriesText}
            onChange={(event) => update({ categoriesText: event.target.value })}
            helperText={t.discountCategoriesHint}
            placeholder="beauty, supplements"
          />
        ) : null}
        {form.scope === "BRAND" ? (
          <TextField
            label={t.discountBrands}
            value={form.brandsText}
            onChange={(event) => update({ brandsText: event.target.value })}
            helperText={t.discountBrandsHint}
            placeholder="Cetaphil"
          />
        ) : null}
        {form.scope === "TAG" ? (
          <TextField
            label={t.discountTags}
            value={form.tagsText}
            onChange={(event) => update({ tagsText: event.target.value })}
            helperText={t.discountTagsHint}
          />
        ) : null}
      </FormSection>

      <FormSection title={t.discountSectionAudience} description={t.discountSectionAudienceHint}>
        <SelectField
          label={t.discountAudience}
          value={form.audience}
          onValueChange={(value) => update({ audience: value as DiscountFormData["audience"] })}
          options={[
            { value: "EVERYONE", label: "EVERYONE" },
            { value: "SPECIFIC_USERS", label: "SPECIFIC_USERS" },
          ]}
        />
        {form.audience === "SPECIFIC_USERS" ? (
          <TextField
            label={t.discountAllowedUsers}
            value={form.allowedUserIdsText}
            onChange={(event) => update({ allowedUserIdsText: event.target.value })}
            helperText={t.discountAllowedUsersHint}
            placeholder="vip"
          />
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleField
            label={t.discountRequireLogin}
            description={t.discountRequireLoginHint}
            checked={form.requireLogin}
            onCheckedChange={(checked) => update({ requireLogin: checked })}
          />
          <ToggleField
            label={t.discountFirstOrderOnly}
            description={t.discountFirstOrderOnlyHint}
            checked={form.firstOrderOnly}
            onCheckedChange={(checked) => update({ firstOrderOnly: checked })}
          />
        </div>
      </FormSection>

      <FormSection title={t.discountSectionLimits} description={t.discountSectionLimitsHint}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t.discountMinOrder}
            type="number"
            min={0}
            step="0.001"
            value={String(form.minimumOrderAmount)}
            onChange={(event) =>
              update({ minimumOrderAmount: Number(event.target.value) || 0 })
            }
          />
          <TextField
            label={t.discountMaxDiscount}
            type="number"
            min={0}
            step="0.001"
            value={form.maximumDiscountAmount ?? ""}
            onChange={(event) =>
              update({
                maximumDiscountAmount:
                  event.target.value === "" ? null : Number(event.target.value),
              })
            }
            placeholder="—"
          />
          <TextField
            label={t.discountUsageLimit}
            type="number"
            min={0}
            value={form.usageLimit ?? ""}
            onChange={(event) =>
              update({ usageLimit: event.target.value === "" ? null : Number(event.target.value) })
            }
            placeholder="—"
          />
          <TextField
            label={t.discountUsageLimitPerUser}
            type="number"
            min={0}
            value={form.usageLimitPerUser ?? ""}
            onChange={(event) =>
              update({
                usageLimitPerUser:
                  event.target.value === "" ? null : Number(event.target.value),
              })
            }
            placeholder="—"
          />
        </div>
      </FormSection>

      <FormSection title={t.discountSectionSchedule} description={t.discountSectionScheduleHint}>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label={t.discountStartsAt}
            type="date"
            value={form.startsAt}
            onChange={(event) => update({ startsAt: event.target.value })}
          />
          <TextField
            label={t.discountExpireAt}
            type="date"
            value={form.expireAt}
            onChange={(event) => update({ expireAt: event.target.value })}
          />
          <TextField
            label={t.discountPriority}
            type="number"
            min={1}
            value={String(form.priority)}
            onChange={(event) => update({ priority: Number(event.target.value) || 1 })}
          />
        </div>
      </FormSection>

      <FormSection title={t.discountSectionBehavior} description={t.discountSectionBehaviorHint}>
        <div className="grid gap-3">
          <ToggleField
            label={t.discountIsAutoApply}
            description={t.discountIsAutoApplyHint}
            checked={form.isAutoApply}
            onCheckedChange={(checked) => update({ isAutoApply: checked })}
          />
          <ToggleField
            label={t.discountIsCombinable}
            description={t.discountIsCombinableHint}
            checked={form.isCombinable}
            onCheckedChange={(checked) => update({ isCombinable: checked })}
          />
          <ToggleField
            label={t.discountAffectsCatalog}
            description={t.discountAffectsCatalogHint}
            checked={form.affectsCatalogPrices}
            onCheckedChange={(checked) => update({ affectsCatalogPrices: checked })}
          />
        </div>
      </FormSection>

      <FormSection title={t.discountSectionStatus}>
        <SelectField
          label={t.status}
          value={form.status}
          onValueChange={(value) => update({ status: value as DiscountFormData["status"] })}
          options={[
            { value: "DRAFT", label: t.draft },
            { value: "ACTIVE", label: t.active },
            { value: "INACTIVE", label: t.inactive },
            { value: "EXPIRED", label: t.expired },
          ]}
        />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{t.discountWebsiteHint}</p>
          <code className="block rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs text-foreground">
            {env.storefrontUrl}/?coupon={form.code || "CODE"}
          </code>
        </div>
        <p className="text-xs text-muted-foreground">{t.discountProductSaleNote}</p>
        <p className="text-xs text-muted-foreground">{t.discountBogoNote}</p>
      </FormSection>

      <CrudFormFooter
        submitLabel={mode === "create" ? t.addDiscount : t.save}
        cancelLabel={t.cancel}
        onCancel={onCancel}
        isLoading={isLoading}
        loadingLabel={t.loadingMessage}
      />
    </CrudFormShell>
  );
}
