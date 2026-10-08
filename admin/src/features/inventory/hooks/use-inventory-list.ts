import { useCallback, useMemo } from "react";

import { inventoryService } from "@/features/inventory/services/inventory.service";
import type { InventoryListParams } from "@/features/inventory/services/inventory.service.types";
import {
  filterInventoryRows,
  flattenProductVariants,
  getInventorySummary,
} from "@/features/inventory/utils/flatten-product-variants";
import type { StockStatus } from "@/features/inventory/types/inventory.types";
import {
  type CrudFilterDefinition,
  mapBooleanFilterValue,
  useServerPaginatedList,
} from "@/shared/crud";
import { CRUD_FILTER_ALL_VALUE } from "@/shared/crud/constants/crud.constants";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

const INVENTORY_FILTER_IDS = ["publish"] as const;
const STOCK_STATUS_FILTER_ID = "stockStatus";

export function useInventoryList(limit = 12) {
  const t = useTranslation();

  const filterDefinitions = useMemo<CrudFilterDefinition[]>(
    () => [
      {
        id: STOCK_STATUS_FILTER_ID,
        label: t.stock,
        allLabel: t.filterAll,
        primary: true,
        options: [
          { value: "in", label: t.inStock },
          { value: "low", label: t.lowStockCount },
          { value: "out", label: t.outOfStock },
        ],
      },
      {
        id: "publish",
        label: t.status,
        allLabel: t.filterAll,
        options: [
          { value: "true", label: t.active },
          { value: "false", label: t.inactive },
        ],
      },
    ],
    [t],
  );

  const mapFiltersToParams = useCallback(
    (values: Record<string, string>) =>
      ({
        publish: mapBooleanFilterValue(values.publish),
      }) satisfies Pick<InventoryListParams, "publish">,
    [],
  );

  const fetchFn = useCallback(
    (params: InventoryListParams & { page: number; limit: number }, signal?: AbortSignal) =>
      inventoryService.list(params, signal),
    [],
  );

  const list = useServerPaginatedList({
    queryKeyPrefix: "inventory-products",
    fetchFn,
    limit,
    filterIds: [...INVENTORY_FILTER_IDS, STOCK_STATUS_FILTER_ID],
    mapFiltersToParams,
    defaultSort: "created_at:desc",
  });

  const allRows = useMemo(() => flattenProductVariants(list.items), [list.items]);
  const stockStatusFilter = list.filters.values[STOCK_STATUS_FILTER_ID];
  const stockStatus =
    stockStatusFilter === CRUD_FILTER_ALL_VALUE
      ? null
      : (stockStatusFilter as StockStatus);

  const filteredRows = useMemo(
    () => filterInventoryRows(allRows, stockStatus, list.search),
    [allRows, stockStatus, list.search],
  );

  const summary = useMemo(() => getInventorySummary(allRows), [allRows]);

  return {
    ...list,
    rows: filteredRows,
    summary,
    filterDefinitions,
  };
}
