import { type InputHTMLAttributes, type ReactNode, useId } from "react";

import { FormField, getFormFieldDescribedBy } from "@/shared/components/forms/FormField";
import { Input } from "@/shared/design-system/components/ui/input";
import { cn } from "@/shared/design-system/components/ui/utils";

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  endAdornment?: ReactNode;
};

export function TextField({
  label,
  helperText,
  error,
  className,
  containerClassName,
  required,
  endAdornment,
  ...props
}: TextFieldProps) {
  const id = useId();

  const input = (
    <Input
      id={id}
      required={required}
      aria-invalid={Boolean(error)}
      aria-describedby={getFormFieldDescribedBy(id, { error, helperText })}
      className={cn(endAdornment ? "pe-10" : undefined, className)}
      {...props}
    />
  );

  return (
    <FormField
      label={label}
      fieldId={id}
      required={required}
      helperText={helperText}
      error={error}
      containerClassName={containerClassName}
    >
      {endAdornment ? (
        <div className="relative">
          {input}
          <div className="absolute end-1 top-1/2 -translate-y-1/2">{endAdornment}</div>
        </div>
      ) : (
        input
      )}
    </FormField>
  );
}
