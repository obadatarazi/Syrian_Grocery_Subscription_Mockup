import { MoreHorizontal } from "lucide-react";

import type { CrudRowAction } from "@/shared/crud/types/crud.types";
import { Button } from "@/shared/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/design-system/components/ui/dropdown-menu";

type CrudTableActionsProps<TEntity> = {
  entity: TEntity;
  actions: CrudRowAction<TEntity>[];
  ariaLabel: string;
};

export function CrudTableActions<TEntity>({
  entity,
  actions,
  ariaLabel,
}: CrudTableActionsProps<TEntity>) {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) return null;

  const defaultActions = visibleActions.filter((action) => action.variant !== "destructive");
  const destructiveActions = visibleActions.filter((action) => action.variant === "destructive");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={ariaLabel}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {defaultActions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            disabled={action.disabled}
            onClick={() => {
              if (action.disabled) return;
              action.onSelect(entity);
            }}
          >
            {action.icon ? <action.icon className="size-4" /> : null}
            {action.label}
          </DropdownMenuItem>
        ))}
        {defaultActions.length > 0 && destructiveActions.length > 0 ? (
          <DropdownMenuSeparator />
        ) : null}
        {destructiveActions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            variant="destructive"
            disabled={action.disabled}
            onClick={() => {
              if (action.disabled) return;
              action.onSelect(entity);
            }}
          >
            {action.icon ? <action.icon className="size-4" /> : null}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
