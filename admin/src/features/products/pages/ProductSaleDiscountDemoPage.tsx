import { useMemo, useState } from "react";

import { ProductSaleDiscountSimulationPanel } from "@/features/products/components/ProductSaleDiscountSimulation";
import {
  createEmptyProductForm,
  createEmptyProductVariantFormItem,
  type ProductFormData,
} from "@/features/products/types/products.types";
import { AppButton, PageContainer, PageHeader } from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { DemoDataBanner } from "@/shared/demo";

function buildDemoForm(mode: "simple" | "variable"): ProductFormData {
  const base = createEmptyProductForm();
  if (mode === "simple") {
    return {
      ...base,
      type: "SIMPLE",
      price: 4.5,
      stock: 20,
      skuCode: "SIMPLE-DEMO",
      eanCode: "000111",
      translations: {
        en: { title: "Demo Cream 250ml", description: "Simple product sale demo" },
        ar: { title: "كريم تجريبي ٢٥٠مل", description: "ديمو تخفيض منتج بسيط" },
      },
    };
  }

  const v1 = createEmptyProductVariantFormItem();
  const v2 = createEmptyProductVariantFormItem();
  const v3 = createEmptyProductVariantFormItem();
  return {
    ...base,
    type: "VARIABLE_PRODUCT",
    price: 5,
    variants: [
      { ...v1, id: 101, skuCode: "SIZE-S", price: 3.5, stock: 10, hasDiscountPrice: true },
      { ...v2, id: 102, skuCode: "SIZE-M", price: 4.5, stock: 8, hasDiscountPrice: true },
      { ...v3, id: 103, skuCode: "SIZE-L", price: 5.5, stock: 5, hasDiscountPrice: false },
    ],
    translations: {
      en: { title: "Demo Serum (S / M / L)", description: "Variable product sale demo" },
      ar: { title: "سيروم تجريبي (S / M / L)", description: "ديمو تخفيض منتج متعدد" },
    },
  };
}

export function ProductSaleDiscountDemoPage() {
  const t = useTranslation();
  const [mode, setMode] = useState<"simple" | "variable">("variable");
  const form = useMemo(() => buildDemoForm(mode), [mode]);

  return (
    <PageContainer>
      <PageHeader
        title={t.productSaleDemoPageTitle}
        description={t.productSaleDemoPageDescription}
      />
      <DemoDataBanner className="mb-4" />
      <div className="mb-4 flex flex-wrap gap-2">
        <AppButton
          type="button"
          variant={mode === "simple" ? "default" : "outline"}
          onClick={() => setMode("simple")}
        >
          {t.productTypeSimple}
        </AppButton>
        <AppButton
          type="button"
          variant={mode === "variable" ? "default" : "outline"}
          onClick={() => setMode("variable")}
        >
          {t.productTypeVariant}
        </AppButton>
      </div>
      <ProductSaleDiscountSimulationPanel
        productId={mode === "simple" ? -1 : -2}
        productType={form.type}
        form={form}
      />
    </PageContainer>
  );
}
