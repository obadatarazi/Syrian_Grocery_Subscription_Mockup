import { isRouteErrorResponse, useRouteError } from "react-router";

import { AppButton, ErrorState } from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

export function RouteErrorFallback() {
  const error = useRouteError();
  const t = useTranslation();

  const description = isRouteErrorResponse(error)
    ? error.statusText || error.data?.message
    : error instanceof Error
      ? error.message
      : t.errorStateDefaultDescription;

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <ErrorState
        title={t.errorStateDefaultTitle}
        description={description ?? t.errorStateDefaultDescription}
        action={
          <AppButton variant="outline" onClick={() => window.location.reload()}>
            {t.tryAgain}
          </AppButton>
        }
        className="max-w-lg"
      />
    </div>
  );
}
