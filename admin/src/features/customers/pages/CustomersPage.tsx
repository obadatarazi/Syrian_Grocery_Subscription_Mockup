import { Eye } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { customerCrmPath } from "@/app/router/routes";
import { CrmStatsGrid } from "@/features/customers/components/CrmStatsGrid";
import { CustomerTagBadges } from "@/features/customers/components/CustomerTagBadges";
import { useCrmStats } from "@/features/customers/hooks/use-crm-stats";
import { useCustomersList } from "@/features/customers/hooks/use-customers-list";
import type { CrmCustomer, CrmSegment } from "@/features/customers/types/customers.types";
import { visibleTags } from "@/features/customers/utils/crm-segments";
import { StatusBadge, UserAvatar } from "@/shared/components";
import {
  CrudEntityNameCell,
  CrudListPage,
  CrudListSection,
  CrudListTable,
  CrudTableActions,
  type CrudRowAction,
} from "@/shared/crud";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { DemoDataBanner, formatKwd, TierBadge } from "@/shared/demo";
import { resolveServiceErrorMessage } from "@/shared/errors";
import { useCrudPageGuidance } from "@/shared/guidance";
import { formatDateTime } from "@/shared/lib/datetime.utils";

export function CustomersPage() {
  const t = useTranslation();
  const { language } = useLocalization();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const guidance = useCrudPageGuidance("customers");
  const {
    items: customers,
    search,
    setSearch,
    resetSearch,
    page,
    setPage,
    setPageSize,
    total,
    pageSize,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    filterDefinitions,
    sort,
    setSort,
    sortDefinitions,
  } = useCustomersList(10);
  const { data: stats } = useCrmStats();

  useEffect(() => {
    const rawId = searchParams.get("id")?.trim();
    if (!rawId) return;
    const id = Number(rawId);
    if (!Number.isFinite(id) || id <= 0) return;
    navigate(customerCrmPath(id), { replace: true });
  }, [navigate, searchParams]);

  useEffect(() => {
    const segment = searchParams.get("segment");
    if (!segment || filters.values.segment === segment) return;
    filters.setFilter("segment", segment);
  }, [filters, searchParams]);

  const openCustomer = useCallback(
    (customer: CrmCustomer) => {
      navigate(customerCrmPath(customer.id));
    },
    [navigate],
  );

  const rowActions = useMemo<CrudRowAction<CrmCustomer>[]>(
    () => [
      {
        id: "view",
        label: t.viewAction,
        icon: Eye,
        onSelect: openCustomer,
      },
    ],
    [openCustomer, t.viewAction],
  );

  const columns = useMemo(
    () => [
      {
        id: "name",
        hideable: false,
        header: t.customer,
        cell: (customer: CrmCustomer) => (
          <CrudEntityNameCell
            placeholder={<UserAvatar name={customer.avatar} size="sm" />}
            size="sm"
            onClick={() => openCustomer(customer)}
          >
            <span className="font-semibold text-foreground">
              {language === "ar" ? customer.nameAr : customer.nameEn}
            </span>
            <span className="block text-xs text-muted-foreground">{customer.phone}</span>
          </CrudEntityNameCell>
        ),
      },
      {
        id: "tier",
        header: t.tier,
        cell: (customer: CrmCustomer) => <TierBadge tier={customer.loyalty.tier} />,
      },
      {
        id: "tags",
        header: t.crmTags,
        cell: (customer: CrmCustomer) => <CustomerTagBadges tags={visibleTags(customer)} />,
      },
      {
        id: "orders",
        header: t.orders,
        cell: (customer: CrmCustomer) => customer.ordersCount,
      },
      {
        id: "spent",
        header: t.spent,
        cell: (customer: CrmCustomer) => (
          <span className="font-semibold text-brand">{formatKwd(customer.spent)}</span>
        ),
      },
      {
        id: "points",
        header: t.points,
        cell: (customer: CrmCustomer) => customer.loyalty.points.toLocaleString(),
      },
      {
        id: "lastOrder",
        header: t.lastOrder,
        cell: (customer: CrmCustomer) => (
          <span className="text-xs text-muted-foreground">
            {customer.lastOrderAt ? formatDateTime(customer.lastOrderAt, language) : "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: t.status,
        cell: (customer: CrmCustomer) => (
          <StatusBadge
            label={customer.status === "active" ? t.active : t.inactive}
            variant={customer.status === "active" ? "success" : "neutral"}
          />
        ),
      },
    ],
    [language, openCustomer, t],
  );

  const activeSegment = (filters.values.segment ?? "") as CrmSegment | "";

  return (
    <CrudListPage
      {...guidance.pageProps}
      title={t.crm}
      description={t.crmPageDescription}
    >
      <DemoDataBanner className="mb-4" />

      {stats ? (
        <div className="mb-5" data-guidance="crm-stats">
          <CrmStatsGrid
            stats={stats}
            activeSegment={activeSegment}
            onSelectSegment={(segment) => {
              filters.setFilter("segment", segment);
              const next = new URLSearchParams(searchParams);
              if (segment) next.set("segment", segment);
              else next.delete("segment");
              next.delete("id");
              setSearchParams(next, { replace: true });
            }}
          />
        </div>
      ) : null}

      <CrudListSection>
        <CrudListTable
          guidanceAnchors={{
            search: guidance.searchDataGuidance,
            filters: guidance.filtersDataGuidance,
            rowActions: guidance.rowActionsDataGuidance,
          }}
          tableId="crm-customers"
          search={{
            value: search,
            onChange: setSearch,
            onReset: resetSearch,
            placeholder: t.crmSearchPlaceholder,
          }}
          filters={{
            definitions: filterDefinitions,
            values: filters.values,
            onChange: (id, value) => {
              filters.setFilter(id, value);
              if (id === "segment") {
                const next = new URLSearchParams(searchParams);
                if (value) next.set("segment", value);
                else next.delete("segment");
                setSearchParams(next, { replace: true });
              }
            },
            onReset: () => {
              filters.resetFilters();
              const next = new URLSearchParams(searchParams);
              next.delete("segment");
              setSearchParams(next, { replace: true });
            },
            hasActiveFilters: filters.hasActiveFilters,
          }}
          sort={{ definitions: sortDefinitions, value: sort, onChange: setSort }}
          columns={columns}
          data={customers}
          isLoading={isLoading}
          isError={isError}
          errorTitle={t.errorStateDefaultTitle}
          errorDescription={resolveServiceErrorMessage(error, t)}
          retryLabel={t.tryAgain}
          onRetry={() => void refetch()}
          emptyTitle={t.noData}
          emptyDescription={t.emptyStateDefaultDescription}
          rowActions={(customer) => (
            <CrudTableActions entity={customer} actions={rowActions} ariaLabel={t.actions} />
          )}
          actionsHeader={t.actions}
          caption={t.customers}
          showingLabel={`${t.showing} ${customers.length} ${t.of} ${total} ${t.results}`}
          pagination={{
            page,
            pageSize,
            totalItems: total,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
            pageSizeLabel: t.perPage,
            previousLabel: t.previous,
            nextLabel: t.nextPage,
          }}
        />
      </CrudListSection>
    </CrudListPage>
  );
}
