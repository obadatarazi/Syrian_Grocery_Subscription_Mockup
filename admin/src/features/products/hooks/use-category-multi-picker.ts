import { useEffect, useMemo, useState } from "react";

import type { RelationPickerSeed } from "@/features/products/types/products.types";
import {
  getMissingRelationPickerIds,
  resolveRelationPickerItems,
  useRelationPickerKnownItems,
} from "@/features/products/hooks/relation-picker.utils";
import { categoriesService } from "@/features/categories/services/categories.service";
import type { Category } from "@/features/categories/types/categories.types";
import { useCrudQuery } from "@/shared/crud";
import {
  formatBilingualLabel,
  getBilingualTitle,
} from "@/shared/lib/translation-display.utils";

const CATEGORY_PICKER_PAGE_SIZE = 10;

type UseCategoryMultiPickerOptions = {
  selectedIds: number[];
  seedItems?: RelationPickerSeed[];
  pickedItems?: RelationPickerSeed[];
  enabled?: boolean;
  isOpen?: boolean;
};

export function getCategoryMultiLabel(category: Category): string {
  return formatBilingualLabel(getBilingualTitle(category.translations, category.title));
}

export function useCategoryMultiPicker({
  selectedIds,
  seedItems = [],
  pickedItems = [],
  enabled = true,
  isOpen = false,
}: UseCategoryMultiPickerOptions) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const listQuery = useCrudQuery({
    queryKey: ["categories", "multi-picker", search, String(page)],
    queryFn: (signal) =>
      categoriesService.list(
        {
          page,
          limit: CATEGORY_PICKER_PAGE_SIZE,
          search: search.trim() || undefined,
          sort: "depth",
          direction: "asc",
        },
        signal,
      ),
    enabled: enabled && isOpen,
  });

  const pageItems = listQuery.data?.data ?? [];
  const knownBeforeFetch = useRelationPickerKnownItems(seedItems, pickedItems, pageItems);
  const missingIds = getMissingRelationPickerIds(selectedIds, knownBeforeFetch);

  const selectedCategoriesQuery = useCrudQuery({
    queryKey: ["categories", "multi-picker", "selected", missingIds.join(",")],
    queryFn: (signal) =>
      Promise.all(missingIds.map((id) => categoriesService.getById(id, signal))),
    enabled: enabled && missingIds.length > 0,
  });

  const fetchedItems = selectedCategoriesQuery.data ?? [];
  const resolvedKnownItems = useRelationPickerKnownItems(
    seedItems,
    pickedItems,
    [...pageItems, ...fetchedItems],
  );
  const selectedCategories = useMemo(
    () => resolveRelationPickerItems<Category>(selectedIds, resolvedKnownItems),
    [resolvedKnownItems, selectedIds],
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = useMemo(() => {
    const total = listQuery.data?.total ?? 0;
    const pageSize = listQuery.data?.pageSize ?? CATEGORY_PICKER_PAGE_SIZE;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [listQuery.data]);

  return {
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    pageCategories: pageItems,
    selectedCategories,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
  };
}
