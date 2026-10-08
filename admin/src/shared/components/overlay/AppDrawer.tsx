import { X } from "lucide-react";
import { type ReactNode, type SyntheticEvent } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/design-system/components/ui/sheet";
import { cn } from "@/shared/design-system/components/ui/utils";
import { useLocalization } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { CRUD_FORM_DRAWER_ANCHORS } from "@/shared/guidance/constants/guidance.constants";
import { destroyActiveTour, isTourActive } from "@/shared/guidance/tours/run-tour";

export type AppDrawerSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<AppDrawerSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
};

type AppDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: AppDrawerSize;
  isLoading?: boolean;
  scrollable?: boolean;
};

function preventDismissWhenLoadingOrTour(isLoading: boolean) {
  return (event: Event | SyntheticEvent) => {
    // Driver.js popovers mount on body; Radix treats clicks on them as "outside"
    // and would close the drawer mid-tour, leaving the tour frozen on the next step.
    if (isLoading || isTourActive()) event.preventDefault();
  };
}

function handleEscapeDuringTour(isLoading: boolean) {
  return (event: Event | SyntheticEvent) => {
    if (isLoading) {
      event.preventDefault();
      return;
    }
    if (isTourActive()) {
      event.preventDefault();
      destroyActiveTour();
    }
  };
}

/**
 * Full-height side panel for create/edit forms. Opens from the end of the
 * reading direction (right in LTR, left in RTL) so it never feels mirrored
 * when the admin switches language.
 */
export function AppDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  size = "md",
  isLoading = false,
  scrollable = true,
}: AppDrawerProps) {
  const { direction } = useLocalization();
  const side = direction === "rtl" ? "left" : "right";

  const handleOpenChange = (next: boolean) => {
    if (!next && isLoading) return;
    onOpenChange(next);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={side}
        hideCloseButton
        data-guidance={CRUD_FORM_DRAWER_ANCHORS.panel}
        className={cn(
          "flex w-full max-w-none flex-col gap-0 overflow-hidden p-0",
          SIZE_CLASSES[size],
          className,
        )}
        aria-busy={isLoading}
        onInteractOutside={preventDismissWhenLoadingOrTour(isLoading)}
        onPointerDownOutside={preventDismissWhenLoadingOrTour(isLoading)}
        onFocusOutside={preventDismissWhenLoadingOrTour(isLoading)}
        onEscapeKeyDown={handleEscapeDuringTour(isLoading)}
        {...(description ? {} : { "aria-describedby": undefined })}
      >
        <div
          className="shrink-0 border-b border-border/50 px-6 pt-6 pb-4"
          data-guidance={CRUD_FORM_DRAWER_ANCHORS.title}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <SheetTitle>{title}</SheetTitle>
              {description ? <SheetDescription>{description}</SheetDescription> : null}
            </div>
            <SheetClose
              disabled={isLoading}
              className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden="true" />
            </SheetClose>
          </div>
        </div>

        {children ? (
          <div
            data-guidance={CRUD_FORM_DRAWER_ANCHORS.body}
            className={cn(
              "min-h-0 flex-1 px-6 py-5",
              scrollable && "overflow-y-auto overscroll-contain",
            )}
          >
            {children}
          </div>
        ) : null}

        {footer ? (
          <div
            className="shrink-0 border-t border-border/50 px-6 py-4"
            data-guidance={CRUD_FORM_DRAWER_ANCHORS.footer}
          >
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end [&_button]:w-full sm:[&_button]:w-auto sm:[&_button]:min-w-[6.5rem]">
              {footer}
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
