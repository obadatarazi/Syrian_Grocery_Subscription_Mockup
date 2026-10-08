import type { Product } from "@/features/products/types/products.types";
import {
  getFeaturedProductImage,
  getProductStorefrontUrl,
} from "@/features/products/utils/product-display.utils";
import { BilingualText, MediaImage } from "@/shared/components";
import { cn } from "@/shared/design-system/components/ui/utils";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import {
  formatBilingualLabel,
  getBilingualTitle,
} from "@/shared/lib/translation-display.utils";

type ProductRowTitleCellProps = {
  product: Product;
  canUpdate: boolean;
  canDelete: boolean;
  canCreate: boolean;
  isDuplicating?: boolean;
  onEdit: (product: Product) => void;
  onQuickEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onOpenTitle: (product: Product) => void;
  dataGuidance?: string;
};

function ActionSeparator() {
  return (
    <span className="text-muted-foreground/50" aria-hidden="true">
      |
    </span>
  );
}

function RowActionButton({
  label,
  onClick,
  className,
  disabled,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "text-[11px] font-medium transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {label}
    </button>
  );
}

/**
 * WordPress-style product name cell: action row space is always reserved so
 * hover only toggles visibility — the table row height never jumps.
 */
export function ProductRowTitleCell({
  product,
  canUpdate,
  canDelete,
  canCreate,
  isDuplicating = false,
  onEdit,
  onQuickEdit,
  onDelete,
  onDuplicate,
  onOpenTitle,
  dataGuidance,
}: ProductRowTitleCellProps) {
  const t = useTranslation();
  const imageUrl = getFeaturedProductImage(product.images);
  const storefrontUrl = getProductStorefrontUrl(product);
  const titleValues = getBilingualTitle(product.translations, product.title);

  return (
    <div
      className="group/name flex items-center justify-center gap-3"
      data-guidance={dataGuidance}
    >
      {imageUrl ? (
        <MediaImage
          src={imageUrl}
          alt={formatBilingualLabel(titleValues)}
          className="size-10 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg"
          aria-hidden="true"
        >
          📦
        </span>
      )}

      <div className="min-w-0 space-y-0.5 text-center">
        <button
          type="button"
          className="min-w-0 text-center text-sm font-semibold leading-5 text-brand transition-colors hover:underline"
          onClick={() => onOpenTitle(product)}
        >
          <BilingualText values={titleValues} />
        </button>

        <div
          className={cn(
            "space-y-0.5 transition-opacity duration-200 ease-out",
            "opacity-0 pointer-events-none",
            "group-hover/name:opacity-100 group-hover/name:pointer-events-auto",
            "group-focus-within/name:opacity-100 group-focus-within/name:pointer-events-auto",
            "max-md:opacity-100 max-md:pointer-events-auto",
          )}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[11px] leading-4">
            <span className="text-muted-foreground">
              {t.idLabel}: {product.id}
            </span>

            {canUpdate ? (
              <>
                <ActionSeparator />
                <RowActionButton
                  label={t.editAction}
                  className="text-brand"
                  onClick={() => onEdit(product)}
                />
                <ActionSeparator />
                <RowActionButton
                  label={t.quickEdit}
                  className="text-brand"
                  onClick={() => onQuickEdit(product)}
                />
              </>
            ) : null}

            {canDelete ? (
              <>
                <ActionSeparator />
                <RowActionButton
                  label={t.deleteAction}
                  className="text-destructive"
                  onClick={() => onDelete(product)}
                />
              </>
            ) : null}
          </div>

          {canCreate || storefrontUrl ? (
            <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[11px] leading-4">
              {canCreate ? (
                <RowActionButton
                  label={t.duplicate}
                  className="text-brand"
                  disabled={isDuplicating}
                  onClick={() => onDuplicate(product)}
                />
              ) : null}

              {canCreate && storefrontUrl ? <ActionSeparator /> : null}

              {storefrontUrl ? (
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="font-medium text-brand hover:underline"
                >
                  {t.viewOnWebsite}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
