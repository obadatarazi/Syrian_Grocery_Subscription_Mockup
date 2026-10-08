import type {
  AdminDiscount,
  CouponAudience,
  CouponScope,
  CouponType,
} from "@/features/discounts/mocks/discount-catalog.seed";
import { env } from "@/shared/lib/env";
import {
  hasFormChanges,
  pickChangedScalar,
} from "@/shared/lib/form/pick-changed-fields";
import type { PaginatedResult } from "@/shared/types";

export type Discount = AdminDiscount;
export type DiscountStatus = AdminDiscount["status"];
export type { CouponAudience, CouponScope, CouponType };

export type DiscountListParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: CouponType;
  status?: DiscountStatus;
  scope?: CouponScope;
  sort?: string;
  direction?: "asc" | "desc";
};

export type DiscountFormData = {
  code: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  type: CouponType;
  value: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  scope: CouponScope;
  audience: CouponAudience;
  firstOrderOnly: boolean;
  requireLogin: boolean;
  isAutoApply: boolean;
  isCombinable: boolean;
  affectsCatalogPrices: boolean;
  status: DiscountStatus;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  priority: number;
  currencyCode: string;
  startsAt: string;
  expireAt: string;
  /** Comma-separated product ids when scope = PRODUCT */
  productIdsText: string;
  /** Comma-separated when scope = CATEGORY */
  categoriesText: string;
  /** Comma-separated when scope = BRAND */
  brandsText: string;
  /** Comma-separated when scope = TAG */
  tagsText: string;
  /** Comma-separated user ids when audience = SPECIFIC_USERS */
  allowedUserIdsText: string;
};

export type DiscountListResult = PaginatedResult<Discount>;

export function createEmptyDiscountForm(): DiscountFormData {
  return {
    code: "",
    titleEn: "",
    titleAr: "",
    descEn: "",
    descAr: "",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    affectsCatalogPrices: false,
    status: "DRAFT",
    usageLimit: null,
    usageLimitPerUser: null,
    priority: 10,
    currencyCode: "KWD",
    startsAt: "2026-08-01",
    expireAt: "2026-12-31",
    productIdsText: "",
    categoriesText: "",
    brandsText: "",
    tagsText: "",
    allowedUserIdsText: "",
  };
}

function joinList(values?: string[] | number[]): string {
  if (!values?.length) return "";
  return values.map(String).join(", ");
}

export function discountToFormData(entity: Discount): DiscountFormData {
  return {
    code: entity.code,
    titleEn: entity.titleEn,
    titleAr: entity.titleAr,
    descEn: entity.descEn,
    descAr: entity.descAr,
    type: entity.type,
    value: entity.value,
    minimumOrderAmount: entity.minimumOrderAmount,
    maximumDiscountAmount: entity.maximumDiscountAmount,
    scope: entity.scope,
    audience: entity.audience,
    firstOrderOnly: entity.firstOrderOnly,
    requireLogin: entity.requireLogin,
    isAutoApply: entity.isAutoApply,
    isCombinable: entity.isCombinable,
    affectsCatalogPrices: Boolean(entity.affectsCatalogPrices),
    status: entity.status,
    usageLimit: entity.usageLimit,
    usageLimitPerUser: entity.usageLimitPerUser,
    priority: entity.priority,
    currencyCode: entity.currencyCode,
    startsAt: entity.startsAt,
    expireAt: entity.expireAt,
    productIdsText: joinList(entity.productIds),
    categoriesText: joinList(entity.categories),
    brandsText: joinList(entity.brands),
    tagsText: joinList(entity.tags),
    allowedUserIdsText: joinList(entity.allowedUserIds),
  };
}

function parseCsv(text: string): string[] {
  return text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseIdCsv(text: string): number[] {
  return parseCsv(text)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

/** Maps form values into an entity patch (excluding id / usageCount / demo-only fields). */
export function formDataToDiscountPatch(
  form: DiscountFormData,
  websiteOrigin = env.storefrontUrl,
): Omit<Discount, "id" | "alreadyUsed" | "usageCount" | "color"> {
  const code = form.code.trim().toUpperCase();
  return {
    code,
    titleEn: form.titleEn.trim(),
    titleAr: form.titleAr.trim(),
    descEn: form.descEn.trim(),
    descAr: form.descAr.trim(),
    type: form.type,
    value: form.type === "FREE_SHIPPING" ? 0 : form.value,
    minimumOrderAmount: form.minimumOrderAmount,
    maximumDiscountAmount: form.maximumDiscountAmount,
    scope: form.scope,
    audience: form.audience,
    firstOrderOnly: form.firstOrderOnly,
    requireLogin: form.requireLogin,
    isAutoApply: form.isAutoApply,
    isCombinable: form.isCombinable,
    affectsCatalogPrices: form.affectsCatalogPrices,
    status: form.status,
    usageLimit: form.usageLimit,
    usageLimitPerUser: form.usageLimitPerUser,
    priority: form.priority,
    currencyCode: form.currencyCode.trim().toUpperCase() || "KWD",
    startsAt: form.startsAt,
    expireAt: form.expireAt,
    websiteUrlHint: `${websiteOrigin}/?coupon=${code}`,
    productIds: form.scope === "PRODUCT" ? parseIdCsv(form.productIdsText) : undefined,
    categories: form.scope === "CATEGORY" ? parseCsv(form.categoriesText) : undefined,
    brands: form.scope === "BRAND" ? parseCsv(form.brandsText) : undefined,
    tags: form.scope === "TAG" ? parseCsv(form.tagsText) : undefined,
    allowedUserIds:
      form.audience === "SPECIFIC_USERS" ? parseCsv(form.allowedUserIdsText) : undefined,
  };
}

const SCALAR_KEYS: (keyof DiscountFormData)[] = [
  "code",
  "titleEn",
  "titleAr",
  "descEn",
  "descAr",
  "type",
  "value",
  "minimumOrderAmount",
  "maximumDiscountAmount",
  "scope",
  "audience",
  "firstOrderOnly",
  "requireLogin",
  "isAutoApply",
  "isCombinable",
  "affectsCatalogPrices",
  "status",
  "usageLimit",
  "usageLimitPerUser",
  "priority",
  "currencyCode",
  "startsAt",
  "expireAt",
  "productIdsText",
  "categoriesText",
  "brandsText",
  "tagsText",
  "allowedUserIdsText",
];

export function pickDiscountFormChanges(
  original: DiscountFormData,
  current: DiscountFormData,
): Partial<DiscountFormData> {
  return pickChangedScalar(original, current, SCALAR_KEYS);
}

export function hasDiscountFormChanges(
  original: DiscountFormData,
  current: DiscountFormData,
): boolean {
  return hasFormChanges(pickDiscountFormChanges(original, current));
}
