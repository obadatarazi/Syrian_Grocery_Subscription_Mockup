import { Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { ProductFormData, ProductType } from "@/features/products/types/products.types";
import {
  createEmptyProductSaleSimulation,
  loadProductSaleSimulation,
  saveProductSaleSimulation,
  simulateProductSaleDiscount,
  type ProductSaleAppliesTo,
  type ProductSaleDiscountSimulation,
  type ProductSaleVariantOption,
} from "@/features/products/types/product-sale-discount.types";
import { formatKwd } from "@/features/products/utils/product-display.utils";
import { SelectField, TextField, ToggleField } from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { cn } from "@/shared/design-system/components/ui/utils";

type ProductSaleDiscountSimulationProps = {
  productId?: number | null;
  productType: ProductType;
  form: ProductFormData;
};

function buildVariantOptions(
  productType: ProductType,
  form: ProductFormData,
  t: { productTypeSimple: string; variants: string },
): ProductSaleVariantOption[] {
  if (productType === "SIMPLE") {
    return [
      {
        key: "simple",
        label: t.productTypeSimple,
        regularPrice: form.price > 0 ? form.price : 5,
      },
    ];
  }

  return form.variants.map((variant, index) => ({
    key: variant.id != null ? `id-${variant.id}` : `new-${index}`,
              label:
                variant.skuCode.trim() ||
                `${t.variants} ${index + 1} · ${formatKwd(variant.price)}`,
              regularPrice: variant.price > 0 ? variant.price : form.price || 5,
            }));
}

export function ProductSaleDiscountSimulationPanel({
  productId = null,
  productType,
  form,
}: ProductSaleDiscountSimulationProps) {
  const t = useTranslation();
  const isVariable = productType === "VARIABLE_PRODUCT";
  const basePrice = form.price > 0 ? form.price : 5;

  const [sim, setSim] = useState<ProductSaleDiscountSimulation>(() => {
    const stored = loadProductSaleSimulation(productId ?? null);
    if (stored) return stored;
    return createEmptyProductSaleSimulation(basePrice);
  });

  const [asOfMode, setAsOfMode] = useState<"today" | "after_end" | "before_start">("today");

  useEffect(() => {
    const stored = loadProductSaleSimulation(productId ?? null);
    if (stored) {
      setSim(stored);
      return;
    }
    setSim(createEmptyProductSaleSimulation(basePrice));
  }, [productId, basePrice]);

  useEffect(() => {
    saveProductSaleSimulation(productId ?? null, sim);
  }, [productId, sim]);

  const variantOptions = useMemo(
    () => buildVariantOptions(productType, form, t),
    [productType, form, t],
  );

  const asOfDate = useMemo(() => {
    const today = new Date();
    if (asOfMode === "today") return today;
    if (asOfMode === "before_start" && sim.startsAt) {
      const start = new Date(`${sim.startsAt}T12:00:00`);
      return new Date(start.getTime() - 24 * 60 * 60 * 1000);
    }
    if (asOfMode === "after_end" && sim.endsAt) {
      const end = new Date(`${sim.endsAt}T12:00:00`);
      return new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }
    return today;
  }, [asOfMode, sim.startsAt, sim.endsAt]);

  const result = useMemo(
    () => simulateProductSaleDiscount(sim, variantOptions, asOfDate),
    [sim, variantOptions, asOfDate],
  );

  const update = (patch: Partial<ProductSaleDiscountSimulation>) => {
    setSim((current) => ({ ...current, ...patch }));
  };

  const toggleVariant = (key: string, checked: boolean) => {
    setSim((current) => {
      const selected = new Set(current.selectedVariantKeys);
      if (checked) selected.add(key);
      else selected.delete(key);
      return { ...current, selectedVariantKeys: [...selected] };
    });
  };

  const reasonLabel = (reason: string) => {
    switch (reason) {
      case "active":
        return t.productSaleReasonActive;
      case "ended":
        return t.productSaleReasonEnded;
      case "not_started":
        return t.productSaleReasonNotStarted;
      case "not_selected":
        return t.productSaleReasonNotSelected;
      default:
        return t.productSaleReasonOff;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50/80 p-4 text-sm text-sky-950">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="space-y-1">
          <p className="font-semibold">{t.productSaleDemoTitle}</p>
          <p className="text-[13px] leading-relaxed opacity-90">{t.productSaleDemoIntro}</p>
          <p className="text-[12px] opacity-80">{t.productSaleDemoVsCoupon}</p>
        </div>
      </div>

      <section className="space-y-4 rounded-xl border border-border bg-muted/15 p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{t.productSaleFieldsTitle}</h3>
          <p className="text-xs text-muted-foreground">{t.productSaleFieldsHint}</p>
        </div>

        <ToggleField
          label={t.productSaleHasDiscount}
          description={t.productSaleHasDiscountHint}
          checked={sim.hasDiscount}
          onCheckedChange={(checked) => update({ hasDiscount: checked })}
        />

        {sim.hasDiscount ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label={t.productSaleRegularPrice}
                type="number"
                min={0}
                step="0.001"
                value={String(sim.regularPrice)}
                onChange={(event) =>
                  update({ regularPrice: Number(event.target.value) || 0 })
                }
                endAdornment={<span className="pe-2 text-xs text-muted-foreground">{t.kwd}</span>}
              />
              <TextField
                label={t.productSaleSalePrice}
                type="number"
                min={0}
                step="0.001"
                value={String(sim.salePrice)}
                onChange={(event) => update({ salePrice: Number(event.target.value) || 0 })}
                helperText={t.productSaleSalePriceHint}
                endAdornment={<span className="pe-2 text-xs text-muted-foreground">{t.kwd}</span>}
              />
              <TextField
                label={t.productSaleStartsAt}
                type="date"
                value={sim.startsAt}
                onChange={(event) => update({ startsAt: event.target.value })}
              />
              <TextField
                label={t.productSaleEndsAt}
                type="date"
                value={sim.endsAt}
                onChange={(event) => update({ endsAt: event.target.value })}
                helperText={t.productSaleEndsAtHint}
              />
            </div>

            {isVariable ? (
              <div className="space-y-3">
                <SelectField
                  label={t.productSaleAppliesTo}
                  value={sim.appliesTo}
                  onValueChange={(value) =>
                    update({ appliesTo: value as ProductSaleAppliesTo })
                  }
                  options={[
                    { value: "ALL_VARIANTS", label: t.productSaleAppliesAll },
                    { value: "SELECTED_VARIANTS", label: t.productSaleAppliesSelected },
                  ]}
                  helperText={t.productSaleAppliesToHint}
                />

                {sim.appliesTo === "SELECTED_VARIANTS" ? (
                  <div className="space-y-2 rounded-xl border border-border bg-background/70 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t.productSalePickVariants}
                    </p>
                    {variantOptions.length === 0 ? (
                      <p className="text-xs text-muted-foreground">{t.productSaleNoVariants}</p>
                    ) : (
                      variantOptions.map((variant) => {
                        const checked = sim.selectedVariantKeys.includes(variant.key);
                        return (
                          <label
                            key={variant.key}
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-sm"
                          >
                            <span className="min-w-0 truncate font-medium">{variant.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="tabular-nums text-xs text-muted-foreground">
                                {formatKwd(variant.regularPrice)}
                              </span>
                              <input
                                type="checkbox"
                                className="size-4 accent-[var(--brand)]"
                                checked={checked}
                                onChange={(event) =>
                                  toggleVariant(variant.key, event.target.checked)
                                }
                              />
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{t.productSaleAllVariantsNote}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{t.productSaleSimpleNote}</p>
            )}
          </>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-brand/20 bg-brand-muted/30 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t.productSaleSimTitle}</h3>
            <p className="text-xs text-muted-foreground">{t.productSaleSimHint}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["today", t.productSaleAsOfToday],
                ["before_start", t.productSaleAsOfBefore],
                ["after_end", t.productSaleAsOfAfter],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAsOfMode(mode)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  asOfMode === mode
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-brand/40",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs font-medium text-brand">
          {result.windowReason === "active"
            ? t.productSaleWindowActive
            : result.windowReason === "ended"
              ? t.productSaleWindowEnded
              : result.windowReason === "not_started"
                ? t.productSaleWindowNotStarted
                : result.windowReason === "missing_sale_price"
                  ? t.productSaleWindowInvalid
                  : t.productSaleWindowOff}
        </p>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-start text-xs text-muted-foreground">
                <th className="px-3 py-2 font-semibold">{t.variants}</th>
                <th className="px-3 py-2 font-semibold">{t.productSaleCustomerSees}</th>
                <th className="px-3 py-2 font-semibold">{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {result.lines.map((line) => (
                <tr key={line.key} className="border-b border-border/60 last:border-0">
                  <td className="px-3 py-2.5 font-medium">{line.label}</td>
                  <td className="px-3 py-2.5">
                    {line.onSale ? (
                      <span className="inline-flex items-baseline gap-2">
                        <span className="font-semibold text-brand tabular-nums">
                          {formatKwd(line.displayPrice)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through tabular-nums">
                          {formatKwd(line.regularPrice)}
                        </span>
                      </span>
                    ) : (
                      <span className="tabular-nums font-medium">
                        {formatKwd(line.displayPrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {reasonLabel(line.reason)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
