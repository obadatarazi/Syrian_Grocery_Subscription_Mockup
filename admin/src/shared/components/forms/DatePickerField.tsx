import { Calendar } from "lucide-react";
import { useId } from "react";

import { FormField } from "@/shared/components/forms/FormField";
import { Input } from "@/shared/design-system/components/ui/input";
import { cn } from "@/shared/design-system/components/ui/utils";

export type DatePickerFieldProps = {
  label: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
};

/**
 * Placeholder field for future date picker integration.
 * Renders a read-only input with calendar affordance.
 */
export function DatePickerField({
  label,
  placeholder = "Select date",
  helperText,
  error,
  required,
  disabled = true,
  containerClassName,
}: DatePickerFieldProps) {
  const id = useId();

  return (
    <FormField
      label={label}
      fieldId={id}
      required={required}
      helperText={helperText}
      error={error}
      containerClassName={containerClassName}
    >
      <div className="relative">
        <Calendar
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="text"
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={cn("ps-9")}
        />
      </div>
    </FormField>
  );
}
