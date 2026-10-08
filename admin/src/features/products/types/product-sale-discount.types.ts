export type ProductSaleAppliesTo = "ALL_VARIANTS" | "SELECTED_VARIANTS";

export type ProductSaleVariantOption = {
  key: string;
  label: string;
  regularPrice: number;
};

export type ProductSaleVariantOverride = {
  key: string;
  salePrice: number;
};

/** Prototype-only product SALE (not coupon). Lives on product/variant pricing. */
export type ProductSaleDiscountSimulation = {
  hasDiscount: boolean;
  regularPrice: number;
  salePrice: number;
  startsAt: string;
  /** Empty = no end (until turned off). */
  endsAt: string;
  appliesTo: ProductSaleAppliesTo;
  selectedVariantKeys: string[];
  /** When selected variants have different sale prices */
  variantOverrides: ProductSaleVariantOverride[];
};

export function createEmptyProductSaleSimulation(
  regularPrice = 5,
): ProductSaleDiscountSimulation {
  const today = new Date();
  const start = today.toISOString().slice(0, 10);
  const end = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return {
    hasDiscount: true,
    regularPrice,
    salePrice: Math.max(0.1, Math.round(regularPrice * 0.8 * 1000) / 1000),
    startsAt: start,
    endsAt: end,
    appliesTo: "ALL_VARIANTS",
    selectedVariantKeys: [],
    variantOverrides: [],
  };
}

export type ProductSaleSimulatedLine = {
  key: string;
  label: string;
  regularPrice: number;
  displayPrice: number;
  onSale: boolean;
  reason: "no_discount" | "not_selected" | "not_started" | "ended" | "active";
};

export type ProductSaleSimulationResult = {
  isWindowActive: boolean;
  windowReason: "off" | "not_started" | "ended" | "active" | "missing_sale_price";
  lines: ProductSaleSimulatedLine[];
};

function parseDateOnly(value: string): Date | null {
  if (!value.trim()) return null;
  const date = new Date(`${value.trim()}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function simulateProductSaleDiscount(
  sim: ProductSaleDiscountSimulation,
  variants: ProductSaleVariantOption[],
  asOf: Date = new Date(),
): ProductSaleSimulationResult {
  if (!sim.hasDiscount) {
    return {
      isWindowActive: false,
      windowReason: "off",
      lines: variants.map((variant) => ({
        key: variant.key,
        label: variant.label,
        regularPrice: variant.regularPrice,
        displayPrice: variant.regularPrice,
        onSale: false,
        reason: "no_discount",
      })),
    };
  }

  if (!(sim.salePrice >= 0) || sim.salePrice >= sim.regularPrice) {
    // still compute lines but flag missing/invalid sale
  }

  const start = parseDateOnly(sim.startsAt);
  const end = parseDateOnly(sim.endsAt);
  const now = asOf;

  let windowReason: ProductSaleSimulationResult["windowReason"] = "active";
  if (start && now < start) windowReason = "not_started";
  else if (end && now > end) windowReason = "ended";
  else if (!(sim.salePrice > 0) || sim.salePrice >= sim.regularPrice) {
    windowReason = "missing_sale_price";
  }

  const isWindowActive = windowReason === "active";
  const selected = new Set(sim.selectedVariantKeys);
  const overrideMap = new Map(sim.variantOverrides.map((row) => [row.key, row.salePrice]));

  const lines: ProductSaleSimulatedLine[] = variants.map((variant) => {
    const included =
      sim.appliesTo === "ALL_VARIANTS" || selected.has(variant.key);

    if (!sim.hasDiscount) {
      return {
        key: variant.key,
        label: variant.label,
        regularPrice: variant.regularPrice,
        displayPrice: variant.regularPrice,
        onSale: false,
        reason: "no_discount",
      };
    }

    if (!included) {
      return {
        key: variant.key,
        label: variant.label,
        regularPrice: variant.regularPrice,
        displayPrice: variant.regularPrice,
        onSale: false,
        reason: "not_selected",
      };
    }

    if (windowReason === "not_started") {
      return {
        key: variant.key,
        label: variant.label,
        regularPrice: variant.regularPrice,
        displayPrice: variant.regularPrice,
        onSale: false,
        reason: "not_started",
      };
    }

    if (windowReason === "ended") {
      return {
        key: variant.key,
        label: variant.label,
        regularPrice: variant.regularPrice,
        displayPrice: variant.regularPrice,
        onSale: false,
        reason: "ended",
      };
    }

    const sale =
      overrideMap.get(variant.key) ??
      (sim.appliesTo === "ALL_VARIANTS" ? sim.salePrice : sim.salePrice);

    const validSale = sale > 0 && sale < variant.regularPrice;
    if (!validSale || windowReason === "missing_sale_price") {
      return {
        key: variant.key,
        label: variant.label,
        regularPrice: variant.regularPrice,
        displayPrice: variant.regularPrice,
        onSale: false,
        reason: "no_discount",
      };
    }

    return {
      key: variant.key,
      label: variant.label,
      regularPrice: variant.regularPrice,
      displayPrice: sale,
      onSale: true,
      reason: "active",
    };
  });

  return { isWindowActive, windowReason, lines };
}

const STORAGE_PREFIX = "aroma_product_sale_sim_";

export function loadProductSaleSimulation(productId: number | null): ProductSaleDiscountSimulation | null {
  if (productId == null) return null;
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${productId}`);
    if (!raw) return null;
    return { ...createEmptyProductSaleSimulation(), ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function saveProductSaleSimulation(
  productId: number | null,
  sim: ProductSaleDiscountSimulation,
): void {
  if (productId == null) return;
  sessionStorage.setItem(`${STORAGE_PREFIX}${productId}`, JSON.stringify(sim));
}
