import { type ReactNode } from "react";

import { EntityMediaThumbnail } from "@/shared/components/data/EntityImagePlaceholder";
import { cn } from "@/shared/design-system/components/ui/utils";

type CrudEntityNameCellProps = {
  imageUrl?: string | null;
  imageAlt?: string;
  /**
   * Shown instead of the image when there is none or the image fails to load.
   * Pass a framed placeholder component (e.g. `CategoryImagePlaceholder`) or a simple emoji.
   */
  placeholder?: ReactNode;
  /** Opens the entity's view dialog when provided; renders static text otherwise. */
  onClick?: () => void;
  children: ReactNode;
  /** `md` (size-10) matches list rows with a feature image, `sm` (size-8) suits compact rows. */
  size?: "sm" | "md";
};

/**
 * Standard "name" column cell used across CRUD tables: an image thumbnail
 * (or placeholder) next to a clickable title that opens the row's view
 * dialog, matching the Categories/Brands table pattern.
 */
export function CrudEntityNameCell({
  imageUrl,
  imageAlt = "",
  placeholder,
  onClick,
  children,
  size = "md",
}: CrudEntityNameCellProps) {
  const dimensionClass = size === "sm" ? "size-8" : "size-10";
  const useEmojiFrame = typeof placeholder === "string" || typeof placeholder === "number";

  const resolvedPlaceholder = !placeholder
    ? null
    : useEmojiFrame
      ? (
          <span
            className={cn(
              dimensionClass,
              "flex shrink-0 items-center justify-center rounded-lg bg-muted text-lg",
            )}
            aria-hidden="true"
          >
            {placeholder}
          </span>
        )
      : (
          placeholder
        );

  return (
    <div className="flex items-center gap-3">
      {imageUrl || resolvedPlaceholder ? (
        <EntityMediaThumbnail
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          size={size}
          placeholder={resolvedPlaceholder}
        />
      ) : null}
      {onClick ? (
        <button
          type="button"
          className="min-w-0 text-left transition-colors hover:text-primary"
          onClick={onClick}
        >
          {children}
        </button>
      ) : (
        <div className="min-w-0">{children}</div>
      )}
    </div>
  );
}
