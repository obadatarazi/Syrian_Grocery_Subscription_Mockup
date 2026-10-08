import { buildAdminDiscounts } from "@/features/discounts/mocks/discount-catalog.seed";
import type { Discount } from "@/features/discounts/types/discounts.types";
import { env } from "@/shared/lib/env";

/** Deep-clone seed rows so the in-memory store can mutate freely. */
export function createDiscountSeedRows(): Discount[] {
  return buildAdminDiscounts(env.storefrontUrl).map((row) => ({
    ...row,
    productIds: row.productIds ? [...row.productIds] : undefined,
    categories: row.categories ? [...row.categories] : undefined,
    brands: row.brands ? [...row.brands] : undefined,
    tags: row.tags ? [...row.tags] : undefined,
    allowedUserIds: row.allowedUserIds ? [...row.allowedUserIds] : undefined,
  }));
}
