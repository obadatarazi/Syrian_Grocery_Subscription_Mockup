import { useCallback, useMemo } from "react";

import { discountsService } from "@/features/discounts/services/discounts.service";
import type { DiscountListParams } from "@/features/discounts/types/discounts.types";
import {
  type CrudFilterDefinition,
  type CrudSortDefinition,
  useServerPaginatedList,
} from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

const DISCOUNT_FILTER_IDS = ["type", "status", "scope"] as const;

export function useDiscountsList(limit = 10) {
  const t = useTranslation();

  const filterDefinitions = useMemo<CrudFilterDefinition[]>(
    () => [
      {
        id: "type",
        label: t.discountType,
        allLabel: t.discountFilterAllTypes,
        primary: true,
        options: [
          { value: "PERCENTAGE", label: t.discountTypePercentage },
          { value: "FIXED", label: t.discountTypeFixed },
          { value: "FREE_SHIPPING", label: t.discountTypeFreeShipping },
        ],
      },
      {
        id: "status",
        label: t.status,
        allLabel: t.discountFilterAllStatuses,
        primary: true,
        options: [
          { value: "ACTIVE", label: t.active },
          { value: "INACTIVE", label: t.inactive },
          { value: "DRAFT", label: t.draft },
          { value: "EXPIRED", label: t.expired },
        ],
      },
      {
        id: "scope",
        label: t.discountScope,
        allLabel: t.discountFilterAllScopes,
        options: [
          { value: "CART", label: "CART" },
          { value: "PRODUCT", label: "PRODUCT" },
          { value: "CATEGORY", label: "CATEGORY" },
          { value: "BRAND", label: "BRAND" },
          { value: "TAG", label: "TAG" },
        ],
      },
    ],
    [t],
  );

  const sortDefinitions = useMemo<CrudSortDefinition[]>(
    () => [
      {
        id: "sort",
        label: t.sortBy,
        options: [
          { value: "priority:asc", label: t.discountSortPriorityAsc },
          { value: "priority:desc", label: t.discountSortPriorityDesc },
          { value: "code:asc", label: t.sortCodeAsc },
          { value: "code:desc", label: t.sortCodeDesc },
          { value: "usage_count:desc", label: t.discountSortUsageDesc },
          { value: "id:desc", label: t.sortIdDesc },
        ],
      },
    ],
    [t],
  );

  const mapFiltersToParams = useCallback(
    (values: Record<string, string>) =>
      ({
        type: (values.type || undefined) as DiscountListParams["type"],
        status: (values.status || undefined) as DiscountListParams["status"],
        scope: (values.scope || undefined) as DiscountListParams["scope"],
      }) satisfies Pick<DiscountListParams, "type" | "status" | "scope">,
    [],
  );

  const fetchFn = useCallback(
    (params: DiscountListParams & { page: number; limit: number }, signal?: AbortSignal) =>
      discountsService.list(params, signal),
    [],
  );

  const list = useServerPaginatedList({
    queryKeyPrefix: "discounts",
    fetchFn,
    limit,
    filterIds: [...DISCOUNT_FILTER_IDS],
    mapFiltersToParams,
    defaultSort: "priority:asc",
  });

  return {
    ...list,
    filterDefinitions,
    sortDefinitions,
  };
}
