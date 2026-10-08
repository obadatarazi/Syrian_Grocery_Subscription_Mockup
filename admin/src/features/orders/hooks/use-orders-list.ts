import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { ordersService } from "@/features/orders/services/orders.service";
import type { OrderListParams } from "@/features/orders/types/orders.types";
import {
  type CrudFilterDefinition,
  type CrudSortDefinition,
  mapBooleanFilterValue,
  mapStringFilterValue,
  useServerPaginatedList,
} from "@/shared/crud";
import {
  useInvoicePaymentProviderOptions,
  useInvoiceStatusOptions,
  useOrderCreatedByOptions,
  useOrderStatusOptions,
} from "@/shared/hooks/use-options";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { useUrlSearchParam } from "@/shared/hooks/use-url-search-param";

const ORDER_FILTER_IDS = ["status", "createdBy", "invoiceStatus", "paymentProvider", "hasDiscount"] as const;

export function useOrdersList(limit = 12) {
  const t = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = useUrlSearchParam();
  const orderRefFromUrl = useUrlSearchParam("orderRefNumber");
  const [orderRefNumber, setOrderRefNumber] = useState(orderRefFromUrl);

  // New deep-links (`?orderRefNumber=`) re-apply the exact filter.
  useEffect(() => {
    setOrderRefNumber(orderRefFromUrl);
  }, [orderRefFromUrl]);

  const clearOrderRefNumber = useCallback(() => {
    setOrderRefNumber("");
    if (!searchParams.has("orderRefNumber")) return;
    const next = new URLSearchParams(searchParams);
    next.delete("orderRefNumber");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const { options: statusOptions } = useOrderStatusOptions();
  const { options: createdByOptions } = useOrderCreatedByOptions();
  const { options: invoiceStatusOptions } = useInvoiceStatusOptions();
  const { options: paymentProviderOptions } = useInvoicePaymentProviderOptions();

  const filterDefinitions = useMemo<CrudFilterDefinition[]>(
    () => [
      {
        id: "status",
        label: t.status,
        allLabel: t.filterAll,
        primary: true,
        options: statusOptions,
      },
      {
        id: "createdBy",
        label: t.orderCreatedBy,
        allLabel: t.filterAll,
        options: createdByOptions,
      },
      {
        id: "invoiceStatus",
        label: t.invoiceStatus,
        allLabel: t.filterAll,
        options: invoiceStatusOptions,
      },
      {
        id: "paymentProvider",
        label: t.payment,
        allLabel: t.filterAll,
        options: paymentProviderOptions,
      },
      {
        id: "hasDiscount",
        label: t.hasDiscount,
        allLabel: t.filterAll,
        options: [
          { value: "true", label: t.withDiscount },
          { value: "false", label: t.withoutDiscount },
        ],
      },
    ],
    [createdByOptions, invoiceStatusOptions, paymentProviderOptions, statusOptions, t],
  );

  const sortDefinitions = useMemo<CrudSortDefinition[]>(
    () => [
      {
        id: "sort",
        label: t.sortBy,
        options: [
          { value: "created_at:desc", label: t.sortNewest },
          { value: "created_at:asc", label: t.sortOldest },
          { value: "total_price:desc", label: t.sortTotalDesc },
          { value: "total_price:asc", label: t.sortTotalAsc },
          { value: "id:desc", label: t.sortIdDesc },
        ],
      },
    ],
    [t],
  );

  const mapFiltersToParams = useCallback(
    (values: Record<string, string>) =>
      ({
        status: mapStringFilterValue(values.status),
        createdBy: mapStringFilterValue(values.createdBy),
        invoiceStatus: mapStringFilterValue(values.invoiceStatus),
        paymentProvider: mapStringFilterValue(values.paymentProvider),
        hasDiscount: mapBooleanFilterValue(values.hasDiscount),
        orderRefNumber: orderRefNumber || undefined,
      }) satisfies Pick<
        OrderListParams,
        | "status"
        | "createdBy"
        | "invoiceStatus"
        | "paymentProvider"
        | "hasDiscount"
        | "orderRefNumber"
      >,
    [orderRefNumber],
  );

  const fetchFn = useCallback(
    (params: OrderListParams & { page: number; limit: number }, signal?: AbortSignal) =>
      ordersService.list(
        {
          ...params,
          search: params.orderRefNumber ? undefined : params.search,
        },
        signal,
      ),
    [],
  );

  const list = useServerPaginatedList({
    queryKeyPrefix: "orders",
    fetchFn,
    limit,
    filterIds: [...ORDER_FILTER_IDS],
    mapFiltersToParams,
    defaultSort: "created_at:desc",
    initialSearch,
  });

  const resetFilters = useCallback(() => {
    list.filters.resetFilters();
    clearOrderRefNumber();
  }, [clearOrderRefNumber, list.filters]);

  return {
    ...list,
    filters: {
      ...list.filters,
      resetFilters,
      hasActiveFilters: list.filters.hasActiveFilters || Boolean(orderRefNumber),
    },
    orderRefNumber,
    clearOrderRefNumber,
    filterDefinitions,
    sortDefinitions,
    statusOptions,
  };
}
