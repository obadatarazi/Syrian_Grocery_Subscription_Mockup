import { Check } from "lucide-react";

import type { Order } from "@/features/orders/types/orders.types";
import { cn } from "@/shared/design-system/components/ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/design-system/components/ui/dropdown-menu";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type StatusOption = {
  value: string;
  label: string;
};

type OrderRowTitleCellProps = {
  order: Order;
  canUpdate: boolean;
  statusOptions: StatusOption[];
  isStatusUpdating?: boolean;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onChangeStatus: (order: Order, status: string) => void;
};

function ActionSeparator() {
  return (
    <span className="text-muted-foreground/50" aria-hidden="true">
      |
    </span>
  );
}

function RowActionButton({
  label,
  onClick,
  className,
  disabled,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "text-[11px] font-medium transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {label}
    </button>
  );
}

/**
 * WordPress-style order number cell with hover quick actions.
 */
export function OrderRowTitleCell({
  order,
  canUpdate,
  statusOptions,
  isStatusUpdating = false,
  onView,
  onEdit,
  onChangeStatus,
}: OrderRowTitleCellProps) {
  const t = useTranslation();
  const currentStatus = order.status?.value ?? "";

  return (
    <div className="group/order-row min-w-0 space-y-0.5">
      <button
        type="button"
        className="font-mono text-xs font-bold whitespace-nowrap text-brand transition-colors hover:underline"
        onClick={() => onView(order)}
      >
        {order.orderRefNumber}
      </button>

      <div
        className={cn(
          "transition-opacity duration-200 ease-out",
          "opacity-0 pointer-events-none",
          "group-hover/order-row:opacity-100 group-hover/order-row:pointer-events-auto",
          "group-focus-within/order-row:opacity-100 group-focus-within/order-row:pointer-events-auto",
          "max-md:opacity-100 max-md:pointer-events-auto",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] leading-4">
          <RowActionButton
            label={t.viewAction}
            className="text-brand"
            onClick={() => onView(order)}
          />

          {canUpdate ? (
            <>
              <ActionSeparator />
              <RowActionButton
                label={t.editAction}
                className="text-brand"
                onClick={() => onEdit(order)}
              />
              <ActionSeparator />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={isStatusUpdating}
                    onClick={(event) => event.stopPropagation()}
                    className="text-[11px] font-medium text-brand transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50"
                  >
                    {t.changeStatus}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
                  {statusOptions.length === 0 ? (
                    <DropdownMenuItem disabled>{t.loadingMessage}</DropdownMenuItem>
                  ) : (
                    statusOptions.map((option) => {
                      const isCurrent = option.value === currentStatus;
                      return (
                        <DropdownMenuItem
                          key={option.value}
                          disabled={isCurrent || isStatusUpdating}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (isCurrent) return;
                            onChangeStatus(order, option.value);
                          }}
                        >
                          <span className="flex-1">{option.label}</span>
                          {isCurrent ? <Check className="size-4 shrink-0" /> : null}
                        </DropdownMenuItem>
                      );
                    })
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
