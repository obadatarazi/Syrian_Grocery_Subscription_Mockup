import { useCallback } from "react";

import { productsService } from "@/features/products/services/products.service";
import type { Product, ProductFormData } from "@/features/products/types/products.types";
import {
  hasProductFormChanges,
  pickProductFormChanges,
  productToFormData,
} from "@/features/products/types/products.types";
import { buildProductDuplicateFormData } from "@/features/products/utils/build-product-duplicate-form";
import { type CrudSaveResult,useCrudMutation, useCrudQuickBooleanMutation } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type UseProductMutationsOptions = {
  onSuccess?: () => void | Promise<void>;
};

export type ProductQuickToggleField =
  | "publish"
  | "featured"
  | "bestSeller"
  | "newlyArrived"
  | "isProductYouWillLove";

export function useProductMutations({ onSuccess }: UseProductMutationsOptions = {}) {
  const t = useTranslation();

  const createMutation = useCrudMutation({
    mutationFn: (data: ProductFormData) => productsService.create(data),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crudCreateSuccess,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess,
  });

  const updateMutation = useCrudMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) =>
      productsService.update(id, data),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crudUpdateSuccess,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess,
  });

  const deleteMutation = useCrudMutation({
    mutationFn: (product: Product) => productsService.delete(product.id),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crudDeleteSuccess,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess,
  });

  const duplicateMutation = useCrudMutation({
    mutationFn: async (product: Product) => {
      const fullProduct = await productsService.getById(product.id);
      const duplicateForm = buildProductDuplicateFormData(fullProduct);
      return productsService.create(duplicateForm);
    },
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.productDuplicateSuccess,
      errorMessage: t.errorMessage,
      loadingMessage: t.productDuplicateLoading,
    },
    onSuccess,
  });

  const { quickToggle: quickToggleField } = useCrudQuickBooleanMutation<number>({
    updateFn: (id, data) => productsService.update(id, data),
  });

  const quickToggle = useCallback(
    (product: Product, field: ProductQuickToggleField, value: boolean) =>
      quickToggleField(product.id, field, value),
    [quickToggleField],
  );

  const save = useCallback(
    async (
      mode: "create" | "edit",
      data: ProductFormData,
      entity?: Product,
      originalForm?: ProductFormData,
    ): Promise<CrudSaveResult | undefined> => {
      if (mode === "create") {
        await createMutation.mutate(data);
        return "saved";
      }
      if (!entity) return undefined;

      const original = originalForm ?? productToFormData(entity);
      if (!hasProductFormChanges(original, data)) {
        return "skipped";
      }

      await updateMutation.mutate({
        id: entity.id,
        data: pickProductFormChanges(original, data),
      });
      return "saved";
    },
    [createMutation, updateMutation],
  );

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    duplicateMutation,
    quickToggle,
    save,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDuplicating: duplicateMutation.isPending,
  };
}
