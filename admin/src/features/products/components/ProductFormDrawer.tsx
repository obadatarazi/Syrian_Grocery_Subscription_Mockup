import { useState } from "react";

import { ProductForm } from "@/features/products/components/ProductForm";
import { useProductMutations } from "@/features/products/hooks/use-product-mutations";
import { productsService } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types/products.types";
import { ConfirmDialog } from "@/shared/components";
import { CrudEntityDrawer, useCrudQuery } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type ProductFormDrawerProps = {
  open: boolean;
  mode: "create" | "edit";
  product?: Product | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void | Promise<void>;
};

export function ProductFormDrawer({
  open,
  mode,
  product,
  onOpenChange,
  onSuccess,
}: ProductFormDrawerProps) {
  const t = useTranslation();
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const { save, isSaving } = useProductMutations({
    onSuccess: async () => {
      await onSuccess();
      setIsDirty(false);
      onOpenChange(false);
    },
  });

  const { data: productDetail, isLoading: isProductLoading } = useCrudQuery({
    queryKey: ["products", "detail", String(product?.id ?? "")],
    queryFn: () => productsService.getById(product!.id),
    enabled: open && mode === "edit" && Boolean(product?.id),
  });

  const resolvedProduct = mode === "edit" ? (productDetail ?? product) : product;

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
        title={mode === "create" ? t.addProduct : t.editProduct}
        size="xl"
        isLoading={isSaving || (mode === "edit" && isProductLoading && !productDetail)}
      >
        <ProductForm
          mode={mode}
          product={resolvedProduct}
          isLoading={isSaving}
          onCancel={requestClose}
          onDirtyChange={setIsDirty}
          onSubmit={async (data, originalForm) => {
            const result = await save(
              mode,
              data,
              resolvedProduct ?? undefined,
              originalForm,
            );
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
