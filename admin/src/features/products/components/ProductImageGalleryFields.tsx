import { Plus, Star, Trash2 } from "lucide-react";

import type { ProductImageFormItem } from "@/features/products/types/products.types";
import { createEmptyProductImageItem } from "@/features/products/types/products.types";
import { AppButton, MediaImage } from "@/shared/components";
import { CrudFileUpload } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { cn } from "@/shared/design-system/components/ui/utils";

type ProductImageGalleryFieldsProps = {
  images: ProductImageFormItem[];
  deletedImageIds: number[];
  onChange: (images: ProductImageFormItem[], deletedImageIds: number[]) => void;
  error?: string;
};

export function ProductImageGalleryFields({
  images,
  deletedImageIds,
  onChange,
  error,
}: ProductImageGalleryFieldsProps) {
  const t = useTranslation();

  const updateImage = (index: number, image: ProductImageFormItem) => {
    const nextImages = images.map((entry, entryIndex) => (entryIndex === index ? image : entry));
    onChange(nextImages, deletedImageIds);
  };

  const setFeatured = (index: number) => {
    onChange(
      images.map((image, entryIndex) => ({ ...image, featured: entryIndex === index })),
      deletedImageIds,
    );
  };

  const addImage = () => {
    onChange([...images, createEmptyProductImageItem(false)], deletedImageIds);
  };

  const removeImage = (index: number) => {
    const target = images[index];
    const nextDeletedIds =
      target?.id && !deletedImageIds.includes(target.id)
        ? [...deletedImageIds, target.id]
        : deletedImageIds;

    const nextImages = images.filter((_, entryIndex) => entryIndex !== index);
    onChange(
      nextImages.length ? nextImages : [createEmptyProductImageItem(true)],
      nextDeletedIds,
    );
  };

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {images.map((image, index) => (
        <div
          key={image.id ?? `new-${index}`}
          className="space-y-3 rounded-xl border border-border bg-muted/10 p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">
              {t.productImage} {index + 1}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFeatured(index)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors",
                  image.featured
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-border text-muted-foreground hover:bg-muted/60",
                )}
              >
                <Star className="size-3" />
                {t.featured}
              </button>
              {images.length > 1 ? (
                <AppButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  aria-label={t.deleteAction}
                >
                  <Trash2 className="size-4" />
                </AppButton>
              ) : null}
            </div>
          </div>

          {image.previewUrl && !image.file ? (
            <div className="overflow-hidden rounded-lg border border-border">
              <MediaImage
                src={image.previewUrl}
                alt=""
                className="max-h-44 w-full object-cover"
              />
            </div>
          ) : null}

          <CrudFileUpload
            label={t.productImage}
            accept="image/*"
            value={image.file}
            onFileSelect={(file) => updateImage(index, { ...image, file })}
          />
        </div>
      ))}

      <AppButton type="button" variant="outline" onClick={addImage}>
        <Plus className="size-4" />
        {t.addImage}
      </AppButton>
    </div>
  );
}
