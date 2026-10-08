import { type ReactNode, useEffect, useMemo, useState } from "react";

import { AttributeValueSelector } from "@/features/products/components/AttributeValueSelector";
import { BrandPicker } from "@/features/products/components/BrandPicker";
import { CategoryMultiPicker } from "@/features/products/components/CategoryMultiPicker";
import { ProductImageGalleryFields } from "@/features/products/components/ProductImageGalleryFields";
import { ProductSaleDiscountSimulationPanel } from "@/features/products/components/ProductSaleDiscountSimulation";
import { ProductTranslationFields } from "@/features/products/components/ProductTranslationFields";
import { ProductVariantFields } from "@/features/products/components/ProductVariantFields";
import { TagMultiPicker } from "@/features/products/components/TagMultiPicker";
import type { Product, ProductFormData } from "@/features/products/types/products.types";
import {
  collectClearedProductFieldLabels,
  createEmptyProductForm,
  createEmptyProductVariantFormItem,
  productToFormData,
  sanitizeVariantsAgainstAttributePool,
} from "@/features/products/types/products.types";
import { buildAttributeSeedsFromProduct } from "@/features/products/utils/build-attribute-seeds-from-product";
import { ConfirmDialog, SelectField, TextField, ToggleField } from "@/shared/components";
import { CrudFileUpload, CrudFormFooter, CrudFormShell } from "@/shared/crud";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/design-system/components/ui/tabs";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { PRODUCT_FORM_ANCHORS } from "@/shared/guidance/constants/guidance.constants";

type ProductFormProps = {
  mode: "create" | "edit";
  product?: Product | null;
  isLoading?: boolean;
  onSubmit: (data: ProductFormData, originalForm?: ProductFormData) => void | Promise<void>;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

function FormSection({
  title,
  description,
  children,
  dataGuidance,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  dataGuidance?: string;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-muted/15 p-4" data-guidance={dataGuidance}>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function hasValidVariantAttributes(
  variant: ProductFormData["variants"][number],
  poolAttributeIds: number[],
  poolAttributeValueIds: number[],
): boolean {
  if (poolAttributeIds.length === 0) return false;
  if (variant.attributeIds.length !== poolAttributeIds.length) return false;
  if (variant.attributeValueIds.length !== poolAttributeIds.length) return false;
  if (!poolAttributeIds.every((id) => variant.attributeIds.includes(id))) return false;
  return variant.attributeValueIds.every((id) => poolAttributeValueIds.includes(id));
}

function isVariantAttributePoolConfigured(form: ProductFormData): boolean {
  return form.attributeIds.length > 0 && form.attributeValueIds.length > 0;
}

function hasValidVariantImages(variant: ProductFormData["variants"][number]): boolean {
  return variant.images.some((image) => image.file instanceof File || Boolean(image.id));
}

function isVariantComplete(
  variant: ProductFormData["variants"][number],
  poolAttributeIds: number[],
  poolAttributeValueIds: number[],
): boolean {
  return (
    Boolean(variant.skuCode.trim()) &&
    Boolean(variant.eanCode.trim()) &&
    hasValidVariantAttributes(variant, poolAttributeIds, poolAttributeValueIds) &&
    hasValidVariantImages(variant)
  );
}

export function ProductForm({
  mode,
  product,
  isLoading = false,
  onSubmit,
  onCancel,
  onDirtyChange,
}: ProductFormProps) {
  const t = useTranslation();
  const typeOptions = useMemo(
    () => [
      { label: t.productTypeSimple, value: "SIMPLE" as const },
      { label: t.productTypeVariant, value: "VARIABLE_PRODUCT" as const },
    ],
    [t.productTypeSimple, t.productTypeVariant],
  );
  const relationSeeds = useMemo(
    () => ({
      brand: product?.brand ?? null,
      categories: product?.categories ?? [],
      tags: product?.tags ?? [],
    }),
    [product],
  );
  const attributeSeeds = useMemo(
    () => (product ? buildAttributeSeedsFromProduct(product) : []),
    [product],
  );
  const [form, setForm] = useState<ProductFormData>(createEmptyProductForm());
  const [initialForm, setInitialForm] = useState<ProductFormData | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [titleErrors, setTitleErrors] = useState<Partial<Record<"en" | "ar", string>>>({});
  const [imagesError, setImagesError] = useState<string | undefined>();
  const [variantsError, setVariantsError] = useState<string | undefined>();
  const [attributesError, setAttributesError] = useState<string | undefined>();
  const [isDirty, setIsDirty] = useState(false);
  const [clearedFieldsConfirm, setClearedFieldsConfirm] = useState<string[] | null>(null);

  useEffect(() => {
    const nextForm = product ? productToFormData(product) : createEmptyProductForm();
    setForm(nextForm);
    setInitialForm(mode === "edit" ? nextForm : null);
    setTitleErrors({});
    setImagesError(undefined);
    setVariantsError(undefined);
    setAttributesError(undefined);
    setIsDirty(false);
    setActiveTab("general");
  }, [product, mode]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const updateForm = (updater: (current: ProductFormData) => ProductFormData) => {
    setForm(updater);
    setIsDirty(true);
  };

  const handleTypeChange = (nextType: ProductFormData["type"]) => {
    updateForm((current) => {
      if (nextType === "SIMPLE") {
        const sourceVariant = current.variants[0];
        return {
          ...current,
          type: nextType,
          skuCode: current.skuCode || sourceVariant?.skuCode || "",
          eanCode: current.eanCode || sourceVariant?.eanCode || "",
          price: current.price || sourceVariant?.price || 0,
          stock: current.stock || sourceVariant?.stock || 0,
          attributeIds: current.attributeIds.length
            ? current.attributeIds
            : (sourceVariant?.attributeIds ?? []),
          attributeValueIds: current.attributeValueIds.length
            ? current.attributeValueIds
            : (sourceVariant?.attributeValueIds ?? []),
          variants: [createEmptyProductVariantFormItem()],
          deletedVariantIds: [],
        };
      }

      if (nextType === "VARIABLE_PRODUCT") {
        if (current.type === "SIMPLE") {
          return {
            ...current,
            type: nextType,
            skuCode: "",
            eanCode: "",
            price: 0,
            stock: 0,
            attributeIds: [...current.attributeIds],
            attributeValueIds: [...current.attributeValueIds],
            variants: [
              {
                ...createEmptyProductVariantFormItem(),
                skuCode: current.skuCode,
                eanCode: current.eanCode,
                price: current.price,
                stock: current.stock,
                attributeIds: [...current.attributeIds],
                attributeValueIds: [...current.attributeValueIds],
              },
            ],
            deletedVariantIds: [],
          };
        }

        const poolAttributeIds = current.attributeIds.length
          ? current.attributeIds
          : [...new Set(current.variants.flatMap((variant) => variant.attributeIds))];
        const poolAttributeValueIds = current.attributeValueIds.length
          ? current.attributeValueIds
          : [...new Set(current.variants.flatMap((variant) => variant.attributeValueIds))];

        return {
          ...current,
          type: nextType,
          skuCode: "",
          eanCode: "",
          price: 0,
          stock: 0,
          attributeIds: poolAttributeIds,
          attributeValueIds: poolAttributeValueIds,
          variants: sanitizeVariantsAgainstAttributePool(
            current.variants.length ? current.variants : [createEmptyProductVariantFormItem()],
            poolAttributeIds,
            poolAttributeValueIds,
          ),
        };
      }

      return current;
    });
  };

  const validateForm = (): { valid: boolean; errorTab?: string } => {
    const nextTitleErrors: Partial<Record<"en" | "ar", string>> = {};
    // Create requires a title. Edit may intentionally clear titles (confirmed separately).
    if (
      mode === "create" &&
      !form.translations.en?.title?.trim() &&
      !form.translations.ar?.title?.trim()
    ) {
      nextTitleErrors.en = t.required;
    }
    setTitleErrors(nextTitleErrors);

    let valid = Object.keys(nextTitleErrors).length === 0;
    let errorTab: string | undefined;

    if (mode === "create") {
      const hasValidImage = form.images.some((image) => image.file instanceof File);
      if (!hasValidImage) {
        setImagesError(t.productImagesRequired);
        valid = false;
        errorTab ??= "media";
      } else {
        setImagesError(undefined);
      }
    }

    if (form.type === "SIMPLE") {
      // Create requires full inventory. Edit may intentionally clear fields (confirmed separately).
      if (mode === "create") {
        const hasSimpleInventory =
          form.skuCode.trim() &&
          form.eanCode.trim() &&
          form.price >= 0 &&
          form.stock >= 0;

        if (!hasSimpleInventory) {
          setAttributesError(t.productSimpleInventoryRequired);
          valid = false;
          errorTab = "attributes";
        } else {
          setAttributesError(undefined);
        }
      } else {
        setAttributesError(undefined);
      }
      setVariantsError(undefined);
    } else {
      if (!isVariantAttributePoolConfigured(form)) {
        setAttributesError(t.productVariantAttributesRequired);
        valid = false;
        errorTab = "attributes";
      } else {
        setAttributesError(undefined);
      }

      if (mode === "create") {
        const allVariantsComplete =
          form.variants.length >= 1 &&
          form.variants.every((variant) =>
            isVariantComplete(variant, form.attributeIds, form.attributeValueIds),
          );

        if (!allVariantsComplete) {
          setVariantsError(t.productVariantsRequired);
          valid = false;
          errorTab ??= "variants";
        } else {
          setVariantsError(undefined);
        }
      } else {
        const incompleteVariants = form.variants.filter(
          (variant) =>
            !isVariantComplete(variant, form.attributeIds, form.attributeValueIds),
        );

        if (incompleteVariants.length > 0) {
          setVariantsError(t.productVariantsRequired);
          valid = false;
          errorTab ??= "variants";
        } else {
          setVariantsError(undefined);
        }
      }
    }

    if (!form.brandId) {
      valid = false;
      errorTab ??= "general";
    }
    if (!form.categoryIds.length) {
      valid = false;
      errorTab ??= "general";
    }
    if (!form.tagIds.length) {
      valid = false;
      errorTab ??= "general";
    }

    if (!valid && Object.keys(nextTitleErrors).length > 0) {
      errorTab ??= "content";
    }

    return { valid, errorTab };
  };

  const submitForm = () => {
    void onSubmit(form, initialForm ?? undefined);
  };

  const getClearedFieldLabels = (): string[] => {
    if (mode !== "edit" || !initialForm) return [];
    return collectClearedProductFieldLabels(initialForm, form, {
      skuCode: t.skuCode,
      eanCode: t.eanCode,
      expiryStartDate: t.expiryStartDate,
      expiryEndDate: t.expiryEndDate,
      titleEnglish: t.titleEnglish,
      titleArabic: t.titleArabic,
      description: t.description,
      benefits: t.benefits,
      ingredients: t.ingredients,
      usageMethod: t.usageMethod,
      warnings: t.warnings,
      productTabAttributes: t.productTabAttributes,
      tabEnglish: t.tabEnglish,
      tabArabic: t.tabArabic,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { valid, errorTab } = validateForm();
    if (!valid) {
      if (errorTab) setActiveTab(errorTab);
      return;
    }

    const clearedLabels = getClearedFieldLabels();
    if (clearedLabels.length > 0) {
      setClearedFieldsConfirm(clearedLabels);
      return;
    }

    submitForm();
  };

  const tabColumns =
    form.type === "VARIABLE_PRODUCT" ? "sm:grid-cols-6" : "sm:grid-cols-5";
  const isVariantPoolConfigured = isVariantAttributePoolConfigured(form);

  const handleAttributePoolChange = (attributeIds: number[], attributeValueIds: number[]) => {
    updateForm((current) => ({
      ...current,
      attributeIds,
      attributeValueIds,
      variants: sanitizeVariantsAgainstAttributePool(
        current.variants,
        attributeIds,
        attributeValueIds,
      ),
    }));
  };

  return (
    <CrudFormShell onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`grid w-full grid-cols-2 gap-1 ${tabColumns}`}
          data-guidance={PRODUCT_FORM_ANCHORS.tabs}
        >
          <TabsTrigger value="general" data-guidance={PRODUCT_FORM_ANCHORS.tabGeneral}>
            {t.productTabGeneral}
          </TabsTrigger>
          <TabsTrigger value="content" data-guidance={PRODUCT_FORM_ANCHORS.tabContent}>
            {t.productTabContent}
          </TabsTrigger>
          <TabsTrigger value="media" data-guidance={PRODUCT_FORM_ANCHORS.tabMedia}>
            {t.productTabMedia}
          </TabsTrigger>
          <TabsTrigger value="attributes" data-guidance={PRODUCT_FORM_ANCHORS.tabAttributes}>
            {t.productTabAttributes}
          </TabsTrigger>
          {form.type === "VARIABLE_PRODUCT" ? (
            <TabsTrigger value="variants" data-guidance={PRODUCT_FORM_ANCHORS.tabVariants}>
              {t.productTabVariants}
            </TabsTrigger>
          ) : null}
          <TabsTrigger value="sale-discount">{t.productTabSaleDiscount}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <FormSection title={t.productTabGeneral}>
            <BrandPicker
              value={form.brandId}
              seedItem={relationSeeds.brand}
              onChange={(brandId) => updateForm((current) => ({ ...current, brandId }))}
            />
            <CategoryMultiPicker
              value={form.categoryIds}
              seedItems={relationSeeds.categories}
              onChange={(categoryIds) => updateForm((current) => ({ ...current, categoryIds }))}
            />
            <TagMultiPicker
              value={form.tagIds}
              seedItems={relationSeeds.tags}
              onChange={(tagIds) => updateForm((current) => ({ ...current, tagIds }))}
            />
            <div data-guidance={PRODUCT_FORM_ANCHORS.type}>
              <SelectField
                label={t.productType}
                value={form.type}
                onValueChange={(value) => handleTypeChange(value as ProductFormData["type"])}
                options={typeOptions}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label={t.expiryStartDate}
                type="date"
                value={form.expiryStartDate}
                onChange={(event) =>
                  updateForm((current) => ({ ...current, expiryStartDate: event.target.value }))
                }
              />
              <TextField
                label={t.expiryEndDate}
                type="date"
                value={form.expiryEndDate}
                onChange={(event) =>
                  updateForm((current) => ({ ...current, expiryEndDate: event.target.value }))
                }
              />
            </div>
          </FormSection>

          <FormSection title={t.productVisibility} dataGuidance={PRODUCT_FORM_ANCHORS.visibility}>
            <ToggleField
              label={t.publish}
              checked={form.publish}
              onCheckedChange={(checked) => updateForm((current) => ({ ...current, publish: checked }))}
            />
            <ToggleField
              label={t.featured}
              checked={form.featured}
              onCheckedChange={(checked) => updateForm((current) => ({ ...current, featured: checked }))}
            />
            <ToggleField
              label={t.bestSeller}
              checked={form.bestSeller}
              onCheckedChange={(checked) =>
                updateForm((current) => ({ ...current, bestSeller: checked }))
              }
            />
            <ToggleField
              label={t.newlyArrived}
              checked={form.newlyArrived}
              onCheckedChange={(checked) =>
                updateForm((current) => ({ ...current, newlyArrived: checked }))
              }
            />
            <ToggleField
              label={t.isProductYouWillLove}
              checked={form.isProductYouWillLove}
              onCheckedChange={(checked) =>
                updateForm((current) => ({ ...current, isProductYouWillLove: checked }))
              }
            />
            <ToggleField
              label={t.hasDiscountPrice}
              checked={form.hasDiscountPrice}
              onCheckedChange={(checked) =>
                updateForm((current) => ({ ...current, hasDiscountPrice: checked }))
              }
            />
            <ToggleField
              label={t.approveAddToCarePlan}
              checked={form.approveAddToCarePlan}
              onCheckedChange={(checked) =>
                updateForm((current) => ({ ...current, approveAddToCarePlan: checked }))
              }
            />
          </FormSection>
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <FormSection title={t.productTabContent} dataGuidance={PRODUCT_FORM_ANCHORS.content}>
            <ProductTranslationFields
              value={form.translations}
              onChange={(translations) => updateForm((current) => ({ ...current, translations }))}
              titleErrors={titleErrors}
              autoFocusFirstField
            />
          </FormSection>
        </TabsContent>

        <TabsContent value="media" className="mt-4 space-y-4">
          <FormSection title={t.productTabMedia} dataGuidance={PRODUCT_FORM_ANCHORS.media}>
            <ProductImageGalleryFields
              images={form.images}
              deletedImageIds={form.deletedImageIds}
              onChange={(images, deletedImageIds) =>
                updateForm((current) => ({ ...current, images, deletedImageIds }))
              }
              error={imagesError}
            />
          </FormSection>

          <FormSection title={t.productVideo}>
            {product?.videoFileUrl && !form.video ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{t.currentVideo}</p>
                <video
                  src={product.videoFileUrl}
                  controls
                  className="max-h-44 w-full rounded-lg border border-border"
                />
              </div>
            ) : null}
            <CrudFileUpload
              label={t.productVideo}
              accept="video/mp4,video/webm,video/quicktime"
              value={form.video}
              onFileSelect={(file) => updateForm((current) => ({ ...current, video: file }))}
            />
          </FormSection>
        </TabsContent>

        <TabsContent value="attributes" className="mt-4">
          {form.type === "SIMPLE" ? (
            <FormSection
              title={t.productTabAttributes}
              description={t.productTabAttributesDescription}
              dataGuidance={PRODUCT_FORM_ANCHORS.attributes}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label={t.skuCode}
                  value={form.skuCode}
                  onChange={(event) =>
                    updateForm((current) => ({ ...current, skuCode: event.target.value }))
                  }
                  required
                />
                <TextField
                  label={t.eanCode}
                  value={form.eanCode}
                  onChange={(event) =>
                    updateForm((current) => ({ ...current, eanCode: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label={t.price}
                  type="number"
                  min={0}
                  step="0.1"
                  value={String(form.price)}
                  onChange={(event) =>
                    updateForm((current) => ({
                      ...current,
                      price: Number(event.target.value) || 0,
                    }))
                  }
                  required
                />
                <TextField
                  label={t.stock}
                  type="number"
                  min={0}
                  value={String(form.stock)}
                  onChange={(event) =>
                    updateForm((current) => ({
                      ...current,
                      stock: Number(event.target.value) || 0,
                    }))
                  }
                  required
                />
              </div>
              <AttributeValueSelector
                attributeIds={form.attributeIds}
                attributeValueIds={form.attributeValueIds}
                onChange={(attributeIds, attributeValueIds) =>
                  updateForm((current) => ({ ...current, attributeIds, attributeValueIds }))
                }
                selectionMode="multi"
                seedAttributes={attributeSeeds}
                enabled={activeTab === "attributes"}
                error={attributesError}
                required={false}
                showVariableProductHint
                allowCreateAttribute
              />
            </FormSection>
          ) : (
            <FormSection
              title={t.productTabAttributes}
              description={t.productVariantAttributesTabDescription}
              dataGuidance={PRODUCT_FORM_ANCHORS.attributes}
            >
              <AttributeValueSelector
                attributeIds={form.attributeIds}
                attributeValueIds={form.attributeValueIds}
                onChange={handleAttributePoolChange}
                selectionMode="multi"
                seedAttributes={attributeSeeds}
                enabled={activeTab === "attributes"}
                error={attributesError}
                label={t.productVariantAllowedAttributes}
                allowCreateAttribute
              />
            </FormSection>
          )}
        </TabsContent>

        {form.type === "VARIABLE_PRODUCT" ? (
          <TabsContent value="variants" className="mt-4">
            <FormSection
              title={t.productTabVariants}
              description={t.productVariantsTabDescription}
            >
              <ProductVariantFields
                type={form.type}
                variants={form.variants}
                deletedVariantIds={form.deletedVariantIds}
                onChange={(variants, deletedVariantIds) =>
                  updateForm((current) => ({ ...current, variants, deletedVariantIds }))
                }
                error={variantsError}
                allowedAttributeIds={form.attributeIds}
                allowedAttributeValueIds={form.attributeValueIds}
                isAttributePoolConfigured={isVariantPoolConfigured}
                seedAttributes={attributeSeeds}
              />
            </FormSection>
          </TabsContent>
        ) : null}

        <TabsContent value="sale-discount" className="mt-4">
          <ProductSaleDiscountSimulationPanel
            productId={product?.id ?? null}
            productType={form.type}
            form={form}
          />
        </TabsContent>
      </Tabs>

      <CrudFormFooter
        submitLabel={mode === "create" ? t.addProduct : t.save}
        cancelLabel={t.cancel}
        onCancel={onCancel}
        isLoading={isLoading}
        loadingLabel={t.loadingMessage}
      />

      <ConfirmDialog
        open={clearedFieldsConfirm != null}
        onOpenChange={(open) => {
          if (!open) setClearedFieldsConfirm(null);
        }}
        title={t.clearEmptyFieldsTitle}
        description={
          clearedFieldsConfirm
            ? t.clearEmptyFieldsDescription.replace(
                "{fields}",
                clearedFieldsConfirm.join(", "),
              )
            : undefined
        }
        confirmLabel={t.clearEmptyFieldsConfirm}
        cancelLabel={t.cancel}
        variant="destructive"
        onConfirm={() => {
          setClearedFieldsConfirm(null);
          submitForm();
        }}
      />
    </CrudFormShell>
  );
}
