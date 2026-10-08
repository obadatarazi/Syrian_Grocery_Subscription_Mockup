import type { Product, ProductImage, ProductVariant } from "@/features/products/types/products.types";
import {
  getProductDisplayPrice,
  getProductStock,
  normalizeProductType,
} from "@/features/products/utils/variant-attribute.utils";
import { env } from "@/shared/lib/env";

export function formatPriceAmount(amount: number): string {
  return Math.round(amount).toLocaleString("ar-SY");
}

/** Format Syrian Pound (SYP) — integer, no decimals. */
export function formatSyp(amount: number): string {
  return `${formatPriceAmount(amount)} ل.س`;
}

/** @deprecated Use formatSyp */
export function formatKwd(amount: number): string {
  return formatSyp(amount);
}

export function getFeaturedProductImage(
  images: ProductImage[] | null | undefined,
): string | null {
  if (!images?.length) return null;
  const featured = images.find((image) => image.featured);
  return featured?.imageFileUrl ?? images[0]?.imageFileUrl ?? null;
}

export function getProductTotalStock(product: Product | ProductVariant[]): number {
  if (Array.isArray(product)) {
    return product.reduce((total, variant) => total + variant.stock, 0);
  }
  return getProductStock(product);
}

export function getProductMinPrice(product: Product | ProductVariant[]): number | null {
  if (Array.isArray(product)) {
    if (!product.length) return null;
    return Math.min(...product.map((variant) => variant.price));
  }
  return getProductDisplayPrice(product);
}

export function formatProductPriceLabel(product: Product, _fromLabel?: string): string {
  const type = normalizeProductType(product.type);

  if (type === "VARIABLE_PRODUCT") {
    const range = product.priceRange;
    const min = range?.min ?? getProductDisplayPrice(product);
    const max =
      range?.max ??
      (product.variants.length
        ? Math.max(...product.variants.map((variant) => variant.price))
        : null);

    if (min == null) return "—";
    if (max == null || max === min) return formatSyp(min);
    return `${formatPriceAmount(min)} – ${formatPriceAmount(max)} ل.س`;
  }

  const price = getProductDisplayPrice(product);
  return price == null ? "—" : formatSyp(price);
}

export function productStockBarColor(stock: number, lowThreshold = 5): string {
  if (stock === 0) return "bg-rose-400";
  if (stock <= lowThreshold) return "bg-amber-400";
  return "bg-emerald-400";
}

export type ProductStockLabelStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export function resolveProductStockStatus(
  product: Product,
  lowThreshold = 5,
): ProductStockLabelStatus {
  const fromApi = product.status?.value;
  if (fromApi === "IN_STOCK" || fromApi === "LOW_STOCK" || fromApi === "OUT_OF_STOCK") {
    return fromApi;
  }

  const stock = getProductTotalStock(product);
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= lowThreshold) return "LOW_STOCK";
  return "IN_STOCK";
}

/** WordPress-style stock label: "In stock (12)", "Low stock (3)", "Out of stock". */
export function formatProductStockLabel(
  product: Product,
  labels: {
    inStock: string;
    lowStock: string;
    outOfStock: string;
  },
  lowThreshold = 5,
): { text: string; status: ProductStockLabelStatus; stock: number } {
  const stock = getProductTotalStock(product);
  const status = resolveProductStockStatus(product, lowThreshold);

  if (status === "OUT_OF_STOCK") {
    return { text: labels.outOfStock, status, stock };
  }
  if (status === "LOW_STOCK") {
    return { text: `${labels.lowStock} (${stock})`, status, stock };
  }
  return { text: `${labels.inStock} (${stock})`, status, stock };
}

export function getProductStorefrontUrl(product: Pick<Product, "translations" | "slug">): string | null {
  const slug =
    product.translations?.en?.slug?.trim() ||
    product.slug?.trim() ||
    product.translations?.ar?.slug?.trim() ||
    "";

  if (!slug) return null;

  const base = env.storefrontUrl;
  return `${base}/product/${encodeURIComponent(slug)}`;
}

export function joinRelationTitles(items: { title: string }[]): string {
  return items.map((item) => item.title).join(", ");
}
