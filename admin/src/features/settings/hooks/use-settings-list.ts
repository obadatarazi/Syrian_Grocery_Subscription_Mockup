import { useCallback, useMemo } from "react";

import { settingsService } from "@/features/settings/services/settings.service";
import type { MultiTypeSettingListParams } from "@/features/settings/types/settings.types";
import {
  type CrudFilterDefinition,
  type CrudSortDefinition,
  isActiveFilterValue,
  useServerPaginatedList,
} from "@/shared/crud";
import { useMultiTypeSettingTypeOptions } from "@/shared/hooks/use-options";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import type { MultiTypeSettingType } from "@/features/settings/types/settings.types";

const SETTINGS_FILTER_IDS = ["type"] as const;

export function useSettingsList(limit = 100) {
  const t = useTranslation();
  const { options: typeOptions } = useMultiTypeSettingTypeOptions();

  const filterDefinitions = useMemo<CrudFilterDefinition[]>(
    () => [
      {
        id: "type",
        label: t.settingType,
        allLabel: t.filterAll,
        primary: true,
        options: typeOptions,
      },
    ],
    [t, typeOptions],
  );

  const sortDefinitions = useMemo<CrudSortDefinition[]>(
    () => [
      {
        id: "sort",
        label: t.sortBy,
        options: [
          { value: "setting_key:asc", label: t.sortSettingKeyAsc },
          { value: "setting_key:desc", label: t.sortSettingKeyDesc },
          { value: "created_at:desc", label: t.sortNewest },
          { value: "created_at:asc", label: t.sortOldest },
          { value: "id:desc", label: t.sortIdDesc },
        ],
      },
    ],
    [t],
  );

  const mapFiltersToParams = useCallback(
    (values: Record<string, string>) =>
      ({
        type: isActiveFilterValue(values.type)
          ? (values.type as MultiTypeSettingType)
          : undefined,
      }) satisfies Pick<MultiTypeSettingListParams, "type">,
    [],
  );

  const fetchFn = useCallback(
    (params: MultiTypeSettingListParams & { page: number; limit: number }, signal?: AbortSignal) =>
      settingsService.list(params, signal),
    [],
  );

  const list = useServerPaginatedList({
    queryKeyPrefix: "multi-type-settings",
    fetchFn,
    limit,
    filterIds: [...SETTINGS_FILTER_IDS],
    mapFiltersToParams,
    defaultSort: "setting_key:asc",
  });

  return {
    ...list,
    filterDefinitions,
    sortDefinitions,
  };
}
