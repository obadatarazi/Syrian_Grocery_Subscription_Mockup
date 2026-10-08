import { ChevronLeft, ChevronRight, LogOut, Shield } from "lucide-react";
import { useMemo } from "react";
import { NavLink } from "react-router";

import { adminNavigationSections, type NavItem } from "@/app/config/navigation";
import { ROUTES } from "@/app/router/routes";
import { canAccessNavItem, useAbility } from "@/features/auth";
import { CaptionText, CardTitleText } from "@/shared/components";
import { Button } from "@/shared/design-system/components/ui/button";
import { cn } from "@/shared/design-system/components/ui/utils";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";

type AdminSidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: () => void;
  hideCollapseButton?: boolean;
  className?: string;
};

function ChevronForward({ isRTL, className }: { isRTL: boolean; className?: string }) {
  const Icon = isRTL ? ChevronLeft : ChevronRight;
  return <Icon className={className} aria-hidden="true" />;
}

type SidebarNavItemProps = {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
  label: string;
};

function SidebarNavItem({ item, collapsed, onNavigate, label }: SidebarNavItemProps) {
  const Icon = item.icon;
  const isAccent = item.variant === "accent";

  return (
    <NavLink
      to={item.href}
      end={item.href === ROUTES.admin.root}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      data-guidance={`nav-${item.id}`}
      className={({ isActive }) =>
        cn(
          "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
          collapsed && "justify-center px-2",
          isAccent
            ? isActive
              ? "bg-accent-brand text-accent-brand-foreground shadow-sm"
              : "text-muted-foreground hover:bg-brand-muted hover:text-brand"
            : isActive
              ? "bg-brand text-brand-foreground shadow-sm shadow-brand/20"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "size-[18px] shrink-0",
              isActive
                ? "text-current"
                : "text-muted-foreground group-hover:text-foreground",
            )}
            aria-hidden="true"
          />
          {!collapsed ? (
            <>
              <span className="flex-1 truncate text-start">{label}</span>
              {item.badge && item.badge > 0 ? (
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[9px] font-bold",
                    isActive
                      ? "bg-card text-brand"
                      : "bg-brand text-brand-foreground",
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </>
          ) : null}
          {collapsed && item.badge && item.badge > 0 ? (
            <span className="absolute end-1 top-1 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[7px] font-bold text-destructive-foreground">
              {item.badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

export function AdminSidebar({
  collapsed,
  onCollapsedChange,
  onNavigate,
  hideCollapseButton = false,
  className,
}: AdminSidebarProps) {
  const t = useTranslation();
  const { direction } = useLocalization();
  const ability = useAbility();
  const isRTL = direction === "rtl";

  const visibleSections = useMemo(
    () =>
      adminNavigationSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => canAccessNavItem(ability, item)),
        }))
        .filter((section) => section.items.length > 0),
    [ability],
  );

  const CollapseIcon = collapsed
    ? isRTL
      ? ChevronLeft
      : ChevronRight
    : isRTL
      ? ChevronRight
      : ChevronLeft;

  return (
    <aside
      className={cn(
        "flex h-full flex-none flex-col overflow-y-auto border-e border-border bg-card transition-[width] duration-300",
        collapsed ? "w-[4.5rem]" : "w-[260px]",
        className,
      )}
    >
      <div className="relative flex h-16 flex-none items-center border-b border-border/60 px-4">
        {!collapsed ? (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex size-8 flex-none items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <Shield className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <CardTitleText className="truncate text-sm font-black leading-none">
                حصري
              </CardTitleText>
              <CaptionText className="text-[10px] text-muted-foreground">{t.adminPanel}</CaptionText>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex size-8 items-center justify-center rounded-xl bg-brand text-brand-foreground">
            <Shield className="size-4" aria-hidden="true" />
          </div>
        )}
        {!collapsed && !hideCollapseButton ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute end-3 top-1/2 size-7 shrink-0 -translate-y-1/2 rounded-full border border-border/60 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => onCollapsedChange(true)}
            aria-label={t.collapseSidebar}
          >
            <CollapseIcon className="size-3.5" />
          </Button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label={t.adminPanel}>
        {visibleSections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={cn(sectionIndex > 0 && "mt-4 border-t border-border/60 pt-4")}
          >
            {!collapsed ? (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-brand">
                {t[section.labelKey]}
              </p>
            ) : sectionIndex > 0 ? (
              <div className="mb-2 border-t border-border/60" />
            ) : null}

            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  label={t[item.labelKey]}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex-none border-t border-border/60 p-2">
        {collapsed ? (
          <div className="space-y-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => onCollapsedChange(false)}
              aria-label={t.expandSidebar}
            >
              <ChevronForward isRTL={isRTL} className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-full rounded-lg text-brand hover:bg-brand/10"
              asChild
              aria-label={t.goToWebsite}
            >
              <a href={ROUTES.root}>
                <LogOut className="size-4" />
              </a>
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="group h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand hover:bg-brand/10"
            asChild
          >
            <a href={ROUTES.root}>
              <span className="flex size-7 flex-none items-center justify-center rounded-lg bg-brand/10 transition-colors group-hover:bg-brand">
                <LogOut className="size-3.5 text-brand transition-colors group-hover:text-brand-foreground" />
              </span>
              <span>{t.goToWebsite}</span>
            </a>
          </Button>
        )}
      </div>
    </aside>
  );
}
