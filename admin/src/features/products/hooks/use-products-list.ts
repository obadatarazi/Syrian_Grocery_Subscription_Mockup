import { useCallback, useMemo } from "react";

import { productsService } from "@/features/products/services/products.service";
import type { ProductListParams } from "@/features/products/types/products.types";
import {
  type CrudFilterDefinition,
  type CrudSortDefinition,
  mapBooleanFilterValue,
  mapIntegerFilterValue,
  mapStringFilterValue,
  useServerPaginatedList,
} from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { useUrlSearchParam } from "@/shared/hooks/use-url-search-param";

const PRODUCT_FILTER_IDS = [
  "publish",
  "brandId",
  "type",
  "categoryId",
  "tagId",
  "featured",
  "bestSeller",
  "newlyArrived",
  "isProductYouWillLove",
] as const;

export function useProductsList(limit = 12) {
  const t = useTranslation();
  const initialSearch = useUrlSearchParam();

  const filterDefinitions = useMemo<CrudFilterDefinition[]>(
    () => [
      {
        id: "publish",
        label: t.status,
        allLabel: t.filterAll,
        primary: true,
        options: [
          { value: "true", label: t.active },
          { value: "false", label: t.inactive },
        ],
      },
      {
        id: "type",
        label: t.productType,
        allLabel: t.filterAll,
        options: [
          { value: "SIMPLE", label: t.productTypeSimple },
          { value: "VARIABLE_PRODUCT", label: t.productTypeVariant },
        ],
      },
      {
        id: "featured",
        label: t.featured,
        allLabel: t.filterAll,
        options: [
          { value: "true", label: t.active },
          { value: "false", label: t.inactive },
        ],
      },
      {
        id: "bestSeller",
        label: t.bestSeller,
        allLabel: t.filterAll,
        options: [
          { value: "true", label: t.active },
          { value: "false", label: t.inactive },
        ],
      },
      {
        id: "newlyArrived",
        label: t.newlyArrived,
        allLabel: t.filterAll,
        options: [
          { value: "true", label: t.active },
          { value: "false", label: t.inactive },
        ],
      },
      {
        id: "isProductYouWillLove",
        label: t.isProductYouWillLove,
        allLabel: t.filterAll,
        options: [
          { value: "true", label: t.active },
          { value: "false", label: t.inactive },
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
          { value: "created_at:desc", label: t.sortNewest },
          { value: "created_at:asc", label: t.sortOldest },
          { value: "title:asc", label: t.sortTitleAsc },
          { value: "title:desc", label: t.sortTitleDesc },
          { value: "id:desc", label: t.sortIdDesc },
        ],
      },
    ],
    [t],
  );

  const mapFiltersToParams = useCallback(
    (values: Record<string, string>) =>
      ({
        publish: mapBooleanFilterValue(values.publish),
        brandId: mapIntegerFilterValue(values.brandId),
        type: mapStringFilterValue(values.type) as ProductListParams["type"] | undefined,
        categoryId: mapIntegerFilterValue(values.categoryId),
        tagId: mapIntegerFilterValue(values.tagId),
        featured: mapBooleanFilterValue(values.featured),
        bestSeller: mapBooleanFilterValue(values.bestSeller),
        newlyArrived: mapBooleanFilterValue(values.newlyArrived),
        isProductYouWillLove: mapBooleanFilterValue(values.isProductYouWillLove),
      }) satisfies Pick<
        ProductListParams,
        | "publish"
        | "brandId"
        | "type"
        | "categoryId"
        | "tagId"
        | "featured"
        | "bestSeller"
        | "newlyArrived"
        | "isProductYouWillLove"
      >,
    [],
  );

  const fetchFn = useCallback(
    (params: ProductListParams & { page: number; limit: number }, signal?: AbortSignal) => productsService.list(params, signal),
    [],
  );

  const list = useServerPaginatedList({
    queryKeyPrefix: "products",
    fetchFn,
    limit,
    filterIds: [...PRODUCT_FILTER_IDS],
    mapFiltersToParams,
    defaultSort: "created_at:desc",
    initialSearch,
  });

  return {
    ...list,
    filterDefinitions,
    sortDefinitions,
  };
}
