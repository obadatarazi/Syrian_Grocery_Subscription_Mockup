import { useEffect, useState } from "react";

import type {
  CrmCustomer,
  CrmCustomerStatus,
  CrmProfileInput,
} from "@/features/customers/types/customers.types";
import {
  AppButton,
  AppDialog,
  EmailField,
  FormRow,
  SelectField,
  TextField,
} from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import type { FieldErrors } from "@/shared/types";

type CustomerCrmProfileDialogProps = {
  open: boolean;
  customer: CrmCustomer;
  isSaving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: CrmProfileInput) => Promise<boolean>;
};

type ProfileForm = CrmProfileInput;

type ProfileErrors = FieldErrors<"nameEn" | "nameAr" | "email" | "phone">;

function toForm(customer: CrmCustomer): ProfileForm {
  return {
    nameEn: customer.nameEn,
    nameAr: customer.nameAr,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
  };
}

export function CustomerCrmProfileDialog({
  open,
  customer,
  isSaving = false,
  onOpenChange,
  onSave,
}: CustomerCrmProfileDialogProps) {
  const t = useTranslation();
  const [form, setForm] = useState<ProfileForm>(() => toForm(customer));
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    if (!open) return;
    setForm(toForm(customer));
    setErrors({});
  }, [open, customer]);

  const updateField = <TField extends keyof ProfileForm>(
    field: TField,
    value: ProfileForm[TField],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    const nextErrors: ProfileErrors = {};
    if (!form.nameEn.trim()) nextErrors.nameEn = t.required;
    if (!form.nameAr.trim()) nextErrors.nameAr = t.required;
    if (!form.phone.trim()) nextErrors.phone = t.required;
    if (!form.email.trim()) nextErrors.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      nextErrors.email = t.invalidEmail;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const saved = await onSave({
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status,
    });
    if (saved) onOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.crmEditProfile}
      description={t.crmEditProfileHint}
      size="lg"
      isLoading={isSaving}
      footer={
        <>
          <AppButton
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            {t.cancel}
          </AppButton>
          <AppButton
            type="button"
            isLoading={isSaving}
            loadingText={t.loadingMessage}
            onClick={() => void handleSave()}
          >
            {t.saveChanges}
          </AppButton>
        </>
      }
    >
      <div className="space-y-4">
        <FormRow>
          <TextField
            label={t.crmNameEn}
            value={form.nameEn}
            onChange={(event) => updateField("nameEn", event.target.value)}
            error={errors.nameEn}
            required
            autoFocus
          />
          <TextField
            label={t.crmNameAr}
            value={form.nameAr}
            onChange={(event) => updateField("nameAr", event.target.value)}
            error={errors.nameAr}
            required
            dir="rtl"
          />
        </FormRow>
        <FormRow>
          <EmailField
            label={t.email}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={errors.email}
            required
          />
          <TextField
            label={t.phone}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            error={errors.phone}
            required
          />
        </FormRow>
        <SelectField
          label={t.status}
          value={form.status}
          onValueChange={(value) => updateField("status", value as CrmCustomerStatus)}
          options={[
            { value: "active", label: t.active },
            { value: "inactive", label: t.inactive },
          ]}
        />
      </div>
    </AppDialog>
  );
}
