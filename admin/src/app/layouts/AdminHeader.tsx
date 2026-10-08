import { Bell, ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router";

import { NotificationMenu } from "@/app/layouts/NotificationMenu";
import { ROUTES } from "@/app/router/routes";
import { LanguageSwitcher } from "@/shared/design-system/components/LanguageSwitcher";
import { Button } from "@/shared/design-system/components/ui/button";
import { Input } from "@/shared/design-system/components/ui/input";
import { cn } from "@/shared/design-system/components/ui/utils";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { GuidanceHelpMenu } from "@/shared/guidance/components/GuidanceHelpMenu";

type AdminHeaderProps = {
  title: string;
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
  showMenuButton?: boolean;
  userMenu?: ReactNode;
  className?: string;
};

function ChevronForward({ isRTL, className }: { isRTL: boolean; className?: string }) {
  const Icon = isRTL ? ChevronLeft : ChevronRight;
  return <Icon className={className} aria-hidden="true" />;
}

export function AdminHeader({
  title,
  onMenuClick,
  onSidebarToggle,
  showMenuButton = false,
  userMenu,
  className,
}: AdminHeaderProps) {
  const t = useTranslation();
  const { direction } = useLocalization();
  const isRTL = direction === "rtl";

  return (
    <header
      className={cn(
        "z-20 flex h-16 flex-none items-center gap-4 border-b border-border bg-card px-4 sm:px-6",
        className,
      )}
    >
      {showMenuButton ? (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl lg:hidden"
          onClick={onMenuClick}
          aria-label={t.openMenu}
        >
          <Menu className="size-5" />
        </Button>
      ) : onSidebarToggle ? (
        <Button
          variant="ghost"
          size="icon"
          className="hidden shrink-0 rounded-xl lg:inline-flex"
          onClick={onSidebarToggle}
          aria-label={t.openMenu}
        >
          <Menu className="size-5" />
        </Button>
      ) : null}

      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          to={ROUTES.admin.root}
          className="font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.adminPanel}
        </Link>
        <ChevronForward isRTL={isRTL} className="size-3.5 shrink-0 text-border" />
        <span className="truncate font-semibold text-foreground">{title}</span>
      </div>

      <div className="relative ms-4 hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t.adminSearchPlaceholder}
          className="w-full rounded-xl border-0 bg-muted ps-9 focus-visible:ring-brand/30"
          aria-label={t.search}
        />
      </div>

      <div className="ms-auto flex items-center gap-1.5">
        <LanguageSwitcher variant="minimal" showText={false} />

        <GuidanceHelpMenu />

        <NotificationMenu
          trigger={
            <Button variant="ghost" size="icon" className="rounded-xl" aria-label={t.notifications}>
              <Bell className="size-5" />
            </Button>
          }
        />

        {userMenu}
      </div>
    </header>
  );
}
