import { ArrowLeft } from "lucide-react";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router";

import { ROUTES } from "@/app/router/routes";
import { CustomerCrmWorkspace } from "@/features/customers/components/CustomerCrmWorkspace";
import { customersService } from "@/features/customers/services/customers.service";
import type { CrmCustomer } from "@/features/customers/types/customers.types";
import {
  AppButton,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from "@/shared/components";
import { useCrudQuery } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { DemoDataBanner } from "@/shared/demo";
import { resolveServiceErrorMessage } from "@/shared/errors";

export function CustomerCrmPage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const customerId = Number(id);

  const queryFn = useCallback(() => customersService.getById(customerId), [customerId]);
  const { data, isLoading, isError, error, refetch, patchData } = useCrudQuery<CrmCustomer>({
    queryKey: ["crm-customers", "detail", String(customerId)],
    queryFn,
    enabled: Number.isFinite(customerId) && customerId > 0,
  });

  return (
    <PageContainer>
      <DemoDataBanner className="mb-4" />
      <PageHeader
        title={data ? t.crmCustomerFile : t.crm}
        description={t.crmFileDescription}
        actions={
          <AppButton variant="outline" onClick={() => navigate(ROUTES.admin.customers)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t.crmBackToList}
          </AppButton>
        }
      />

      {isLoading ? <LoadingState label={t.loadingMessage} /> : null}

      {isError || (!isLoading && !data) ? (
        <ErrorState
          title={t.errorStateDefaultTitle}
          description={resolveServiceErrorMessage(error, t)}
          action={
            <AppButton variant="outline" onClick={() => void refetch()}>
              {t.tryAgain}
            </AppButton>
          }
        />
      ) : null}

      {data ? (
        <CustomerCrmWorkspace
          customer={data}
          onCustomerChange={(customer) => patchData(() => customer)}
        />
      ) : null}
    </PageContainer>
  );
}
