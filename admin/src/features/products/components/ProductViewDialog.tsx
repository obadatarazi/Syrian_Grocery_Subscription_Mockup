import { Star } from "lucide-react";

import { useProductReviewsPreview } from "@/features/product-reviews/hooks/use-product-reviews-preview";
import { getReviewCustomerLabel } from "@/features/product-reviews/types/product-reviews.types";
import { ProductVisibilityBadges } from "@/features/products/components/ProductVisibilityBadges";
import type { ProductQuickToggleField } from "@/features/products/hooks/use-product-mutations";
import type { Product } from "@/features/products/types/products.types";
import { getProductBilingualSlugs } from "@/features/products/types/products.types";
import {
  formatKwd,
  formatProductPriceLabel,
  getFeaturedProductImage,
  getProductTotalStock,
  joinRelationTitles,
} from "@/features/products/utils/product-display.utils";
import {
  getAttributeItemLabel,
  getVariantDisplayLabel,
  normalizeProductType,
} from "@/features/products/utils/variant-attribute.utils";
import { BilingualText, MediaImage, StatusBadge, ToggleField } from "@/shared/components";
import { CrudDetailField, CrudViewDialog, type CrudViewDialogSection } from "@/shared/crud";
import { Skeleton } from "@/shared/design-system/components/ui/skeleton";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import {
  getBilingualDescription,
  getBilingualTitle,
} from "@/shared/lib/translation-display.utils";

type ProductViewDialogProps = {
  open: boolean;
  product: Product | null;
  canUpdate?: boolean;
  canDelete?: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggle?: (product: Product, field: ProductQuickToggleField, value: boolean) => void;
  isToggleLoading?: (productId: number, field: ProductQuickToggleField) => boolean;
};

export function ProductViewDialog({
  open,
  product,
  canUpdate = false,
  canDelete = false,
  onOpenChange,
  onEdit,
  onDelete,
  onToggle,
  isToggleLoading,
}: ProductViewDialogProps) {
  const t = useTranslation();
  const {
    reviews,
    totalReviews,
    isLoading: isReviewsLoading,
  } = useProductReviewsPreview({
    productId: product?.id ?? null,
    enabled: open && Boolean(product?.id),
  });

  if (!open) return null;

  // Deep-link / URL stub: wait for getById before rendering fields that need full product.
  if (!product) {
    return (
      <CrudViewDialog
        open={open}
        entity={null}
        onOpenChange={onOpenChange}
        title={t.viewProduct}
        cancelLabel={t.cancel}
        hero={
          <div className="space-y-3">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        }
      />
    );
  }

  const title = getBilingualTitle(product.translations, product.title);
  const slugs = getProductBilingualSlugs(product);
  const description = getBilingualDescription(product.translations, product.description);
  const featuredImage = getFeaturedProductImage(product.images);
  const totalStock = getProductTotalStock(product);

  const productType = normalizeProductType(product.type);

  const sections: CrudViewDialogSection[] = [
    {
      id: "general",
      title: t.productTabGeneral,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.brand}>
            {product.brand?.title ?? t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.productType}>
            {productType === "SIMPLE" ? t.productTypeSimple : t.productTypeVariant}
          </CrudDetailField>
          <CrudDetailField label={t.categoriesCol}>
            {joinRelationTitles(product.categories ?? [])}
          </CrudDetailField>
          <CrudDetailField label={t.tags}>{joinRelationTitles(product.tags ?? [])}</CrudDetailField>
          <CrudDetailField label={t.skuCode}>{product.skuCode || t.notSet}</CrudDetailField>
          <CrudDetailField label={t.eanCode}>{product.eanCode || t.notSet}</CrudDetailField>
          <CrudDetailField label={t.stock}>{totalStock}</CrudDetailField>
          <CrudDetailField label={t.status}>
            {product.status?.label ?? t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.averageRating}>
            {product.averageRating != null ? (
              <span className="inline-flex items-center gap-1 text-amber-600">
                <Star className="size-3.5 fill-current" aria-hidden="true" />
                {product.averageRating}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
          <CrudDetailField label={t.price}>
            {formatProductPriceLabel(product)}
          </CrudDetailField>
          <CrudDetailField label={t.expiryStartDate}>
            {product.expiryStartDate || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.expiryEndDate}>
            {product.expiryEndDate || t.notSet}
          </CrudDetailField>
        </div>
      ),
    },
    {
      id: "visibility",
      title: t.productVisibility,
      content: (
        <div className="space-y-3">
          <ToggleField
            label={t.publish}
            checked={product.publish ?? false}
            disabled={!canUpdate || isToggleLoading?.(product.id, "publish")}
            onCheckedChange={(checked) => onToggle?.(product, "publish", checked)}
          />
          <ToggleField
            label={t.featured}
            checked={product.featured ?? false}
            disabled={!canUpdate || isToggleLoading?.(product.id, "featured")}
            onCheckedChange={(checked) => onToggle?.(product, "featured", checked)}
          />
          <ToggleField
            label={t.bestSeller}
            checked={product.bestSeller ?? false}
            disabled={!canUpdate || isToggleLoading?.(product.id, "bestSeller")}
            onCheckedChange={(checked) => onToggle?.(product, "bestSeller", checked)}
          />
          <ToggleField
            label={t.newlyArrived}
            checked={product.newlyArrived ?? false}
            disabled={!canUpdate || isToggleLoading?.(product.id, "newlyArrived")}
            onCheckedChange={(checked) => onToggle?.(product, "newlyArrived", checked)}
          />
          <ToggleField
            label={t.isProductYouWillLove}
            checked={product.isProductYouWillLove ?? false}
            disabled={!canUpdate || isToggleLoading?.(product.id, "isProductYouWillLove")}
            onCheckedChange={(checked) => onToggle?.(product, "isProductYouWillLove", checked)}
          />
        </div>
      ),
    },
    {
      id: "content",
      title: t.productTabContent,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.titleEnglish}>
            {title.en || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.titleArabic}>
            {title.ar ? (
              <span dir="rtl" className="block">
                {title.ar}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
          <CrudDetailField label={`${t.slug} (${t.tabEnglish})`}>
            {slugs.en ? (
              <span className="font-mono text-sm">{slugs.en}</span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
          <CrudDetailField label={`${t.slug} (${t.tabArabic})`}>
            {slugs.ar ? (
              <span dir="ltr" className="block font-mono text-sm">
                {slugs.ar}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
          <CrudDetailField label={t.descriptionEnglish}>
            {description.en || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.descriptionArabic}>
            {description.ar ? (
              <span dir="rtl" className="block">
                {description.ar}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
          <CrudDetailField label={t.benefits}>
            {product.benefits || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.ingredients}>
            {product.ingredients || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.usageMethod}>
            {product.usageMethod || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.warnings}>
            {product.warnings || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
        </div>
      ),
    },
    {
      id: "media",
      title: t.productTabMedia,
      content: (
        <div className="space-y-4">
          {product.images.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {product.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg border border-border">
                  <MediaImage
                    src={image.imageFileUrl ?? undefined}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  {image.featured ? (
                    <p className="px-2 py-1 text-xs text-muted-foreground">{t.featured}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t.notSet}</p>
          )}
          {product.videoFileUrl ? (
            <video
              src={product.videoFileUrl}
              controls
              className="max-h-56 w-full rounded-lg border border-border"
            />
          ) : null}
        </div>
      ),
    },
    {
      id: "variants",
      title: t.variants,
      content: productType === "SIMPLE" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <CrudDetailField label={t.productAttributes}>
            {product.attributeValues.length
              ? product.attributeValues.map(getAttributeItemLabel).join(" · ")
              : t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.price}>
            {product.price != null ? formatKwd(product.price) : t.notSet}
          </CrudDetailField>
        </div>
      ) : (
        <div className="space-y-3">
          {product.variants.map((variant) => (
            <div
              key={variant.id}
              className="rounded-xl border border-border bg-muted/10 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <CrudDetailField label={t.variantTitle}>
                  {getVariantDisplayLabel(variant)}
                </CrudDetailField>
                <CrudDetailField label={t.skuCode}>{variant.skuCode || t.notSet}</CrudDetailField>
                <CrudDetailField label={t.eanCode}>{variant.eanCode || t.notSet}</CrudDetailField>
                <CrudDetailField label={t.price}>{formatKwd(variant.price)}</CrudDetailField>
                <CrudDetailField label={t.stock}>{variant.stock}</CrudDetailField>
                <CrudDetailField label={t.hasDiscountPrice}>
                  {variant.hasDiscountPrice ? t.active : t.inactive}
                </CrudDetailField>
              </div>
              {variant.images.length ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {variant.images.map((image) => (
                    <MediaImage
                      key={image.id}
                      src={image.imageFileUrl ?? undefined}
                      alt=""
                      className="aspect-square rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "reviews",
      title: t.productTabReviews,
      content: (
        <div className="space-y-3">
          {isReviewsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : reviews.length ? (
            <>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-border bg-muted/10 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {getReviewCustomerLabel(review)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                      <Star className="size-3.5 fill-current" aria-hidden="true" />
                      {review.ratingStar} ★
                    </span>
                  </div>
                  {review.comment ? (
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  ) : null}
                </div>
              ))}
              {totalReviews > reviews.length ? (
                <p className="text-xs text-muted-foreground">
                  {t.showing} {reviews.length} {t.of} {totalReviews} {t.productReviews}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t.noReviews}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <CrudViewDialog
      open={open}
      entity={product}
      onOpenChange={onOpenChange}
      title={t.viewProduct}
      cancelLabel={t.cancel}
      canUpdate={canUpdate}
      canDelete={canDelete}
      editLabel={t.editAction}
      deleteLabel={t.deleteAction}
      onEdit={onEdit}
      onDelete={onDelete}
      sections={sections}
      hero={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {featuredImage ? (
            <MediaImage
              src={featuredImage}
              alt=""
              className="size-20 shrink-0 rounded-xl border border-border object-cover shadow-sm"
            />
          ) : (
            <div
              className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-background text-3xl"
              aria-hidden="true"
            >
              📦
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <BilingualText values={title} titleClassName="text-lg font-semibold" />
              <p className="mt-1 text-sm text-muted-foreground">{product.brand.title}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ProductVisibilityBadges product={product} />
              <StatusBadge
                label={productType === "SIMPLE" ? t.productTypeSimple : t.productTypeVariant}
                variant="neutral"
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
