import { cn } from "@/shared/design-system/components/ui/utils";
import type { BilingualTextValues } from "@/shared/lib/translation-display.utils";

type BilingualTextProps = {
  values: BilingualTextValues;
  titleClassName?: string;
  secondaryClassName?: string;
  className?: string;
};

export function BilingualText({
  values,
  titleClassName,
  secondaryClassName,
  className,
}: BilingualTextProps) {
  const { en, ar } = values;

  if (!en && !ar) {
    return <span className={className}>—</span>;
  }

  if (en && ar && en === ar) {
    return <span className={cn("font-semibold text-foreground", titleClassName, className)}>{en}</span>;
  }

  return (
    <div className={cn("space-y-0.5", className)}>
      {en ? (
        <div className={cn("font-semibold text-foreground", titleClassName)}>{en}</div>
      ) : null}
      {ar ? (
        <div className={cn("text-sm text-muted-foreground", secondaryClassName)} dir="rtl">
          {ar}
        </div>
      ) : null}
    </div>
  );
}
