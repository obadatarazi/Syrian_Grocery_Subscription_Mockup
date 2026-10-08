import { type ReactNode } from "react";
import { Navigate } from "react-router";

import { ROUTES } from "@/app/router/routes";
import { useAuth } from "@/features/auth";
import { LoadingState } from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const t = useTranslation();

  if (isLoading) {
    return <LoadingState label={t.loadingMessage} className="min-h-screen" />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.admin.root} replace />;
  }

  return children;
}
