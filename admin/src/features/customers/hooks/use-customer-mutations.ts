import { useCallback } from "react";

import { customersService } from "@/features/customers/services/customers.service";
import type {
  CrmCustomer,
  CrmNoteInput,
  CrmProfileInput,
} from "@/features/customers/types/customers.types";
import { invalidateQueryCache, useCrudMutation } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

function refreshCrm() {
  invalidateQueryCache("crm-customers");
  invalidateQueryCache("crm-stats");
  invalidateQueryCache("crm-report");
}

type UseCustomerMutationsOptions = {
  onSuccess?: (customer: CrmCustomer) => void | Promise<void>;
};

export function useCustomerMutations({ onSuccess }: UseCustomerMutationsOptions = {}) {
  const t = useTranslation();

  const after = useCallback(
    async (customer: CrmCustomer) => {
      refreshCrm();
      await onSuccess?.(customer);
    },
    [onSuccess],
  );

  const addNote = useCrudMutation({
    mutationFn: ({ id, input }: { id: number; input: CrmNoteInput }) =>
      customersService.addNote(id, input),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crmNoteAdded,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess: after,
  });

  const toggleCarePlan = useCrudMutation({
    mutationFn: (customer: CrmCustomer) => customersService.toggleCarePlan(customer.id),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crmCarePlanUpdated,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess: after,
  });

  const toggleVip = useCrudMutation({
    mutationFn: (customer: CrmCustomer) => customersService.toggleTag(customer.id, "vip"),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crmTagsUpdated,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess: after,
  });

  const sendNotification = useCrudMutation({
    mutationFn: (customer: CrmCustomer) => customersService.sendNotification(customer.id),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crmNotificationSent,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess: after,
  });

  const assignCoupon = useCrudMutation({
    mutationFn: (customer: CrmCustomer) => customersService.assignCoupon(customer.id),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crmCouponAssigned,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess: after,
  });

  const updateProfile = useCrudMutation({
    mutationFn: ({ id, input }: { id: number; input: CrmProfileInput }) =>
      customersService.updateProfile(id, input),
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.crmProfileUpdated,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess: after,
  });

  return {
    addNote,
    toggleCarePlan,
    toggleVip,
    sendNotification,
    assignCoupon,
    updateProfile,
    isBusy:
      addNote.isPending ||
      toggleCarePlan.isPending ||
      toggleVip.isPending ||
      sendNotification.isPending ||
      assignCoupon.isPending ||
      updateProfile.isPending,
  };
}
