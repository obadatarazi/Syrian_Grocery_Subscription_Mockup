import { useCallback, useEffect, useRef } from "react";

import { meNotificationsService } from "@/features/notifications/services/me-notifications.service";
import type {
  Notification,
  NotificationListResult,
} from "@/features/notifications/types/notifications.types";
import { invalidateQueryCache, useCrudMutation, useCrudQuery } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

export const MY_NOTIFICATIONS_QUERY_KEY = ["me-notifications", "list"] as const;

export function useMyNotifications(limit = 10) {
  const query = useCrudQuery<NotificationListResult>({
    queryKey: [...MY_NOTIFICATIONS_QUERY_KEY, String(limit)],
    queryFn: (signal) =>
      meNotificationsService.list(
        {
          page: 1,
          limit,
          sort: "created_at",
          direction: "desc",
        },
        signal,
      ),
    staleTime: 30_000,
  });

  const refetchRef = useRef(query.refetch);
  refetchRef.current = query.refetch;

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refetchRef.current();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return query;
}

export function useMyNotificationMutations(onChanged?: () => void | Promise<void>) {
  const t = useTranslation();

  const invalidate = useCallback(async () => {
    invalidateQueryCache("me-notifications");
    await onChanged?.();
  }, [onChanged]);

  const markReadMutation = useCrudMutation({
    mutationFn: (notification: Notification) =>
      meNotificationsService.markRead(notification.id, true),
    feedback: {
      errorMessage: t.errorMessage,
    },
    onSuccess: invalidate,
  });

  const markAllReadMutation = useCrudMutation({
    mutationFn: async (_: void) => {
      await meNotificationsService.markAllRead();
    },
    feedback: {
      successMessage: t.successMessage,
      successDescription: t.notificationsMarkedAllRead,
      errorMessage: t.errorMessage,
      loadingMessage: t.loadingMessage,
    },
    onSuccess: invalidate,
  });

  return {
    markRead: markReadMutation.mutate,
    markAllRead: () => markAllReadMutation.mutate(undefined),
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
}
