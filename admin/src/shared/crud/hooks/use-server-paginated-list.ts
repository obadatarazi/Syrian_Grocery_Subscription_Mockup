import { useCallback, useEffect, useMemo, useState } from "react";

import { useCrudFilters } from "@/shared/crud/hooks/use-crud-filters";
import { useCrudQuery } from "@/shared/crud/hooks/use-crud-query";
import { useCrudSearch } from "@/shared/crud/hooks/use-crud-search";
import { useCrudSelection } from "@/shared/crud/hooks/use-crud-selection";
import type { CrudFilterValues } from "@/shared/crud/types/crud.types";
import { parseSortParam, sanitizeFilterParams } from "@/shared/crud/utils/filter.utils";
import type { PaginatedResult } from "@/shared/types";

type ServerListParams = {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
};

type UseServerPaginatedListOptions<T> = {
  queryKeyPrefix: string;
  fetchFn: (params: ServerListParams, signal?: AbortSignal) => Promise<PaginatedResult<T>>;
  limit?: number;
  filterIds?: string[];
  defaultFilterValues?: Partial<CrudFilterValues>;
  mapFiltersToParams?: (
    values: CrudFilterValues,
  ) => Record<string, string | number | boolean | undefined>;
  defaultSort?: string;
  /** Seeds the search field (e.g. from `?search=` deep links). */
  initialSearch?: string;
};

export function useServerPaginatedList<T>({
  queryKeyPrefix,
  fetchFn,
  limit: initialLimit = 10,
  filterIds = [],
  defaultFilterValues,
  mapFiltersToParams,
  defaultSort = "created_at:desc",
  initialSearch = "",
}: UseServerPaginatedListOptions<T>) {
  const { search, debouncedSearch, setSearch, resetSearch } = useCrudSearch(initialSearch);
  const filters = useCrudFilters(filterIds, defaultFilterValues);
  const selection = useCrudSelection();
  const [sort, setSort] = useState(defaultSort);
  const [limit, setLimit] = useState(initialLimit);

  const filterParams = useMemo(
    () => sanitizeFilterParams(mapFiltersToParams?.(filters.values) ?? {}),
    [filters.values, mapFiltersToParams],
  );

  const apiParamsSignature = useMemo(() => JSON.stringify(filterParams), [filterParams]);

  // Always send sort/direction — including the default — so Laravel does not fall
  // back to unsorted (typically id asc / oldest first) when the UI expects newest first.
  const sortParams = useMemo(() => {
    if (!sort) return {};
    return parseSortParam(sort);
  }, [sort]);

  const filterSignature = useMemo(
    () => filterIds.map((id) => `${id}:${filters.values[id] ?? ""}`).join("|"),
    [filterIds, filters.values],
  );

  /**
   * Search/filter/sort/page-size identity. When this changes, page must be 1 on the same
   * render that builds the query — not in a later effect (which caused page=N
   * fetches with the new criteria).
   */
  const listCriteriaKey = useMemo(
    () => `${debouncedSearch}\0${filterSignature}\0${sort}\0${limit}`,
    [debouncedSearch, filterSignature, sort, limit],
  );

  const [pagination, setPagination] = useState({ page: 1, criteriaKey: listCriteriaKey });

  // Derive page synchronously so params/queryKey never use a stale page with new criteria.
  const page = pagination.criteriaKey === listCriteriaKey ? pagination.page : 1;

  const setPage = useCallback(
    (nextPage: number) => {
      setPagination({ page: nextPage, criteriaKey: listCriteriaKey });
    },
    [listCriteriaKey],
  );

  const setPageSize = useCallback((nextPageSize: number) => {
    setLimit(Math.max(1, nextPageSize));
  }, []);

  const params = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      ...sortParams,
      ...filterParams,
    }),
    [page, limit, debouncedSearch, sortParams, filterParams],
  );

  const queryFn = useCallback(
    (signal?: AbortSignal) => fetchFn(params, signal),
    [fetchFn, params],
  );

  const query = useCrudQuery({
    queryKey: [
      queryKeyPrefix,
      String(page),
      debouncedSearch,
      String(limit),
      filterSignature,
      apiParamsSignature,
      sort,
    ],
    queryFn,
  });

  const total = query.data?.total ?? 0;
  const pageSize = limit;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = query.data?.data ?? [];

  const patchItems = useCallback(
    (updater: (items: T[]) => T[]) => {
      query.patchData((previous) => ({
        ...previous,
        data: updater(previous.data),
      }));
    },
    [query.patchData],
  );

  useEffect(() => {
    selection.clearSelection();
  }, [page, limit, debouncedSearch, filterSignature, sort, selection.clearSelection]);

  return {
    ...query,
    search,
    setSearch,
    resetSearch,
    page,
    setPage,
    setPageSize,
    total,
    totalPages,
    pageSize,
    items,
    patchItems,
    filters,
    sort,
    setSort,
    selection,
  };
}
