import type {
  Product,
  ProductBrand,
  ProductRelationItem,
  ProductVariant,
} from "@/features/products/types/products.types";
import type { ProductAttributeItem, ProductTypeInput } from "@/features/products/utils/variant-attribute.utils";
import { normalizeProductType } from "@/features/products/utils/variant-attribute.utils";
import type { ProductTranslationsInput } from "@/shared/lib/api/form-data.utils";
import {
  getTitleFromApiTranslations,
  normalizeTranslationsFromApi,
} from "@/shared/lib/api/normalize-translations.utils";

function mapRelationItem(item: {
  id: number;
  title?: string;
  translations?: unknown;
}): ProductRelationItem {
  const translations = normalizeTranslationsFromApi<{ title?: string }>(item.translations);

  return {
    id: item.id,
    title: getTitleFromApiTranslations(item.translations, item.title ?? ""),
    ...(translations ? { translations } : {}),
  };
}

function mapAttributeItem(item: {
  id: number;
  title?: string;
  translations?: unknown;
  attribute?: {
    id: number;
    title?: string;
    translations?: unknown;
  } | null;
}): ProductAttributeItem {
  const translations = normalizeTranslationsFromApi<{ title?: string }>(item.translations);
  const attribute = item.attribute
    ? {
        id: item.attribute.id,
        title: getTitleFromApiTranslations(item.attribute.translations, item.attribute.title ?? ""),
        translations: normalizeTranslationsFromApi<{ title?: string }>(item.attribute.translations),
      }
    : null;

  return {
    id: item.id,
    title: getTitleFromApiTranslations(item.translations, item.title ?? ""),
    ...(translations ? { translations } : {}),
    ...(attribute ? { attribute } : {}),
  };
}

function mapBrand(brand: ProductBrand & { translations?: unknown }): ProductBrand {
  return {
    id: brand.id,
    title: getTitleFromApiTranslations(brand.translations, brand.title ?? ""),
    logoFileUrl: brand.logoFileUrl ?? null,
  };
}

function mapProductTranslations(translations: unknown): ProductTranslationsInput | undefined {
  const normalized = normalizeTranslationsFromApi<{
    title?: string;
    slug?: string;
    description?: string;
    benefits?: string;
    ingredients?: string;
    usageMethod?: string;
    warnings?: string;
  }>(translations);

  if (!normalized) return undefined;

  return {
    en: {
      title: normalized.en?.title ?? "",
      slug: normalized.en?.slug ?? "",
      description: normalized.en?.description ?? "",
      benefits: normalized.en?.benefits ?? "",
      ingredients: normalized.en?.ingredients ?? "",
      usageMethod: normalized.en?.usageMethod ?? "",
      warnings: normalized.en?.warnings ?? "",
    },
    ar: {
      title: normalized.ar?.title ?? "",
      slug: normalized.ar?.slug ?? "",
      description: normalized.ar?.description ?? "",
      benefits: normalized.ar?.benefits ?? "",
      ingredients: normalized.ar?.ingredients ?? "",
      usageMethod: normalized.ar?.usageMethod ?? "",
      warnings: normalized.ar?.warnings ?? "",
    },
  };
}

export function mapProductVariantFromApi(variant: ProductVariant): ProductVariant {
  return {
    ...variant,
    attributes: (variant.attributes ?? []).map(mapAttributeItem),
    attributeValues: (variant.attributeValues ?? []).map(mapAttributeItem),
  };
}

function normalizeStockStatus(
  status: Product["status"] | string | null | undefined,
): Product["status"] {
  if (status == null || status === "") return null;
  if (typeof status === "string") {
    return { value: status as NonNullable<Product["status"]>["value"], label: status };
  }
  return status;
}

function mapListImages(product: Product & { featuredImageUrl?: string | null }): Product["images"] {
  if (product.images?.length) return product.images;
  if (product.featuredImageUrl) {
    return [{ id: 0, imageFileUrl: product.featuredImageUrl, featured: true }];
  }
  return [];
}

/** Normalizes product payloads from admin/public API (id or slug) into admin UI shape. */
export function mapProductFromApi(product: Product & { featuredImageUrl?: string | null }): Product {
  const translations =
    mapProductTranslations(product.translations) ?? product.translations;

  return {
    ...product,
    type: normalizeProductType(product.type as ProductTypeInput),
    status: normalizeStockStatus(product.status),
    priceRange: product.priceRange ?? null,
    approveAddToCarePlan: product.approveAddToCarePlan ?? false,
    hasDiscountPrice: product.hasDiscountPrice ?? false,
    bestSeller: product.bestSeller ?? false,
    newlyArrived: product.newlyArrived ?? false,
    featured: product.featured ?? false,
    isProductYouWillLove: product.isProductYouWillLove ?? false,
    publish: product.publish ?? false,
    reviewsCount: product.reviewsCount ?? product.reviews?.length ?? null,
    title: getTitleFromApiTranslations(product.translations, product.title ?? ""),
    brand: product.brand
      ? mapBrand(product.brand as ProductBrand & { translations?: unknown })
      : { id: 0, title: "" },
    categories: (product.categories ?? []).map(mapRelationItem),
    tags: (product.tags ?? []).map(mapRelationItem),
    attributes: (product.attributes ?? []).map(mapAttributeItem),
    attributeValues: (product.attributeValues ?? []).map(mapAttributeItem),
    images: mapListImages(product),
    variants: (product.variants ?? []).map(mapProductVariantFromApi),
    translations,
  };
}
