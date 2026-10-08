import { type ReactNode, useState } from "react";
import { Outlet, useLocation } from "react-router";

import { adminNavigation, designSystemNavItem } from "@/app/config/navigation";
import { AdminHeader } from "@/app/layouts/AdminHeader";
import { AdminSidebar } from "@/app/layouts/AdminSidebar";
import { ROUTES } from "@/app/router/routes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/design-system/components/ui/sheet";
import { useIsMobile } from "@/shared/design-system/components/ui/use-mobile";
import { cn } from "@/shared/design-system/components/ui/utils";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";

function resolvePageTitle(pathname: string, t: ReturnType<typeof useTranslation>) {
  const allItems = [...adminNavigation, designSystemNavItem];
  const match = allItems.find((item) =>
    item.href === ROUTES.admin.root
      ? pathname === ROUTES.admin.root
      : pathname.startsWith(item.href),
  );
  return match ? t[match.labelKey] : t.adminDashboard;
}

type DashboardLayoutProps = {
  userMenu?: ReactNode;
};

export function DashboardLayout({ userMenu }: DashboardLayoutProps) {
  const t = useTranslation();
  const { direction } = useLocalization();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = resolvePageTitle(location.pathname, t);
  const sheetSide = direction === "rtl" ? "right" : "left";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isMobile ? <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} /> : null}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side={sheetSide} className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{t.adminPanel}</SheetTitle>
          </SheetHeader>
          <AdminSidebar
            collapsed={false}
            onCollapsedChange={() => undefined}
            onNavigate={() => setMobileOpen(false)}
            hideCollapseButton
            className="w-full border-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader
          title={pageTitle}
          showMenuButton={isMobile}
          onMenuClick={() => setMobileOpen(true)}
          onSidebarToggle={!isMobile ? () => setCollapsed((value) => !value) : undefined}
          userMenu={userMenu}
        />
        <main className={cn("flex-1 overflow-y-auto")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
