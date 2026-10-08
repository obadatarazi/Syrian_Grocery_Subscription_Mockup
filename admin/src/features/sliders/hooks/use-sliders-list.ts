import { useCallback, useMemo } from "react";

import { slidersService } from "@/features/sliders/services/sliders.service";
import type { SliderListParams } from "@/features/sliders/types/sliders.types";
import {
  type CrudFilterDefinition,
  type CrudSortDefinition,
  mapBooleanFilterValue,
  useServerPaginatedList,
} from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

const SLIDER_FILTER_IDS = ["publish"] as const;

export function useSlidersList(limit = 10) {
  const t = useTranslation();

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
      }) satisfies Pick<SliderListParams, "publish">,
    [],
  );

  const fetchFn = useCallback(
    (params: SliderListParams & { page: number; limit: number }, signal?: AbortSignal) => slidersService.list(params, signal),
    [],
  );

  const list = useServerPaginatedList({
    queryKeyPrefix: "sliders",
    fetchFn,
    limit,
    filterIds: [...SLIDER_FILTER_IDS],
    mapFiltersToParams,
    defaultSort: "created_at:desc",
  });

  return {
    ...list,
    filterDefinitions,
    sortDefinitions,
  };
}
