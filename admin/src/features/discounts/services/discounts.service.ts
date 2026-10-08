import { createDiscountSeedRows } from "@/features/discounts/mocks/discounts.mocks";
import type { DiscountsService } from "@/features/discounts/services/discounts.service.types";
import {
  type Discount,
  type DiscountFormData,
  type DiscountListParams,
  formDataToDiscountPatch,
} from "@/features/discounts/types/discounts.types";
import { ServiceError } from "@/shared/errors";
import { mockDelay } from "@/shared/lib/mock";

const DELAY_MS = 50;

let store: Discount[] = createDiscountSeedRows();
let nextId = Math.max(0, ...store.map((row) => row.id)) + 1;

function clone(discount: Discount): Discount {
  return {
    ...discount,
    productIds: discount.productIds ? [...discount.productIds] : undefined,
    categories: discount.categories ? [...discount.categories] : undefined,
    brands: discount.brands ? [...discount.brands] : undefined,
    tags: discount.tags ? [...discount.tags] : undefined,
    allowedUserIds: discount.allowedUserIds ? [...discount.allowedUserIds] : undefined,
  };
}

function sortRows(rows: Discount[], sort?: string, direction?: "asc" | "desc"): Discount[] {
  const dir = direction === "asc" ? 1 : -1;
  const key = sort ?? "priority";

  return [...rows].sort((a, b) => {
    switch (key) {
      case "code":
        return a.code.localeCompare(b.code) * dir;
      case "usage_count":
      case "usageCount":
        return (a.usageCount - b.usageCount) * dir;
      case "id":
        return (a.id - b.id) * dir;
      case "priority":
      default:
        return (a.priority - b.priority) * dir;
    }
  });
}

function mergeFormOntoEntity(
  entity: Discount,
  data: Partial<DiscountFormData>,
): Discount {
  const base = {
    ...discountToMergedForm(entity),
    ...data,
  };
  const patch = formDataToDiscountPatch(base);
  return {
    ...entity,
    ...patch,
  };
}

function discountToMergedForm(entity: Discount): DiscountFormData {
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
    productIdsText: (entity.productIds ?? []).join(", "),
    categoriesText: (entity.categories ?? []).join(", "),
    brandsText: (entity.brands ?? []).join(", "),
    tagsText: (entity.tags ?? []).join(", "),
    allowedUserIdsText: (entity.allowedUserIds ?? []).join(", "),
  };
}

function createMockDiscountsService(): DiscountsService {
  return {
    async list(params: DiscountListParams = {}) {
      await mockDelay(DELAY_MS);

      const page = params.page ?? 1;
      const pageSize = params.limit ?? 10;
      const search = params.search?.trim().toLowerCase() ?? "";

      let rows = store.filter((row) => {
        if (params.type && row.type !== params.type) return false;
        if (params.status && row.status !== params.status) return false;
        if (params.scope && row.scope !== params.scope) return false;
        if (!search) return true;
        const hay = `${row.code} ${row.titleEn} ${row.titleAr} ${row.descEn} ${row.descAr}`.toLowerCase();
        return hay.includes(search);
      });

      rows = sortRows(rows, params.sort, params.direction);

      const total = rows.length;
      const start = (page - 1) * pageSize;
      const data = rows.slice(start, start + pageSize).map(clone);

      return { data, total, page, pageSize };
    },

    async getById(id: number) {
      await mockDelay(DELAY_MS);
      const found = store.find((row) => row.id === id);
      if (!found) throw new ServiceError("not_found");
      return clone(found);
    },

    async create(data: DiscountFormData) {
      await mockDelay(DELAY_MS);
      const patch = formDataToDiscountPatch(data);
      const created: Discount = {
        ...patch,
        id: nextId++,
        alreadyUsed: false,
        usageCount: 0,
        color: "from-brand to-accent-brand",
      };
      store = [created, ...store];
      return clone(created);
    },

    async update(id: number, data: Partial<DiscountFormData>) {
      await mockDelay(DELAY_MS);
      const index = store.findIndex((row) => row.id === id);
      if (index < 0) throw new ServiceError("not_found");
      const updated = mergeFormOntoEntity(store[index]!, data);
      store = store.map((row, i) => (i === index ? updated : row));
      return clone(updated);
    },

    async delete(id: number) {
      await mockDelay(DELAY_MS);
      const exists = store.some((row) => row.id === id);
      if (!exists) throw new ServiceError("not_found");
      store = store.filter((row) => row.id !== id);
    },
  };
}

/** Prototype always uses the in-memory mock — no API client. */
export const discountsService: DiscountsService = createMockDiscountsService();
