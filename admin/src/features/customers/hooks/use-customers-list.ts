import { useCallback, useMemo } from "react";

import { customersService } from "@/features/customers/services/customers.service";
import type { CrmCustomerListParams, CrmSegment, CrmTag } from "@/features/customers/types/customers.types";
import { type CrudFilterDefinition, type CrudSortDefinition, useServerPaginatedList } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

const FILTER_IDS = ["segment", "tag", "status", "carePlan"] as const;

export function useCustomersList(limit = 10) {
  const t = useTranslation();

  const filterDefinitions = useMemo<CrudFilterDefinition[]>(
    () => [
      {
        id: "segment",
        label: t.crmSegment,
        allLabel: t.crmFilterAllSegments,
        primary: true,
        options: [
          { value: "new_buyers", label: t.crmSegmentNewBuyers },
          { value: "repeat_buyers", label: t.crmSegmentRepeatBuyers },
          { value: "care_plan", label: t.crmSegmentCarePlan },
          { value: "inactive", label: t.crmSegmentInactive },
          { value: "big_spenders", label: t.crmSegmentBigSpenders },
        ],
      },
      {
        id: "tag",
        label: t.crmTags,
        allLabel: t.crmFilterAllTags,
        primary: true,
        options: [
          { value: "vip", label: t.crmTagVip },
          { value: "care_plan", label: t.crmTagCarePlan },
          { value: "prescription", label: t.crmTagPrescription },
          { value: "high_value", label: t.crmTagHighValue },
          { value: "inactive", label: t.crmTagInactive },
        ],
      },
      {
        id: "status",
        label: t.status,
        allLabel: t.crmFilterAllStatuses,
        options: [
          { value: "active", label: t.active },
          { value: "inactive", label: t.inactive },
        ],
      },
      {
        id: "carePlan",
        label: t.crmCarePlan,
        allLabel: t.crmFilterAnyPlan,
        options: [
          { value: "yes", label: t.crmHasCarePlan },
          { value: "no", label: t.crmNoCarePlan },
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
          { value: "spent:desc", label: t.crmSortSpentDesc },
          { value: "spent:asc", label: t.crmSortSpentAsc },
          { value: "ordersCount:desc", label: t.crmSortOrdersDesc },
          { value: "joinedAt:desc", label: t.crmSortJoinedDesc },
          { value: "name:asc", label: t.crmSortNameAsc },
        ],
      },
    ],
    [t],
  );

  const mapFiltersToParams = useCallback(
    (values: Record<string, string>) =>
      ({
        segment: (values.segment || undefined) as CrmSegment | undefined,
        tag: (values.tag || undefined) as CrmTag | undefined,
        status: (values.status || undefined) as CrmCustomerListParams["status"],
        carePlan: (values.carePlan || undefined) as CrmCustomerListParams["carePlan"],
      }) satisfies Pick<CrmCustomerListParams, "segment" | "tag" | "status" | "carePlan">,
    [],
  );

  const fetchFn = useCallback(
    (params: CrmCustomerListParams & { page: number; limit: number }, signal?: AbortSignal) =>
      customersService.list(params, signal),
    [],
  );

  const list = useServerPaginatedList({
    queryKeyPrefix: "crm-customers",
    fetchFn,
    limit,
    filterIds: [...FILTER_IDS],
    mapFiltersToParams,
    defaultSort: "spent:desc",
  });

  return {
    ...list,
    filterDefinitions,
    sortDefinitions,
  };
}
