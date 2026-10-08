import {
  AlertTriangle,
  ClipboardList,
  FileText,
  Package,
  type LucideIcon,
  MessageSquareWarning,
  ShieldAlert,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";

import type { NotificationTypeValue } from "@/features/notifications/types/notifications.types";

type NotificationVisual = {
  icon: LucideIcon;
  /** Icon glyph color */
  iconClass: string;
  /** Soft tinted chip behind the icon */
  chipClass: string;
};

const NOTIFICATION_VISUALS: Record<NotificationTypeValue, NotificationVisual> = {
  ORDER: {
    icon: ClipboardList,
    iconClass: "text-sky-600",
    chipClass: "bg-sky-100 ring-1 ring-sky-200/80",
  },
  STOCK: {
    icon: Package,
    iconClass: "text-amber-600",
    chipClass: "bg-amber-100 ring-1 ring-amber-200/80",
  },
  RX: {
    icon: FileText,
    iconClass: "text-violet-600",
    chipClass: "bg-violet-100 ring-1 ring-violet-200/80",
  },
  CUSTOMER: {
    icon: Users,
    iconClass: "text-emerald-600",
    chipClass: "bg-emerald-100 ring-1 ring-emerald-200/80",
  },
  PAYMENT: {
    icon: Wallet,
    iconClass: "text-teal-600",
    chipClass: "bg-teal-100 ring-1 ring-teal-200/80",
  },
  PROMO: {
    icon: Sparkles,
    iconClass: "text-pink-600",
    chipClass: "bg-pink-100 ring-1 ring-pink-200/80",
  },
  REVIEW: {
    icon: Star,
    iconClass: "text-orange-500",
    chipClass: "bg-orange-100 ring-1 ring-orange-200/80",
  },
  CUSTOM: {
    icon: MessageSquareWarning,
    iconClass: "text-slate-600",
    chipClass: "bg-slate-100 ring-1 ring-slate-200/80",
  },
  WARNING: {
    icon: AlertTriangle,
    iconClass: "text-amber-700",
    chipClass: "bg-amber-100 ring-1 ring-amber-300/80",
  },
  ERROR: {
    icon: ShieldAlert,
    iconClass: "text-red-600",
    chipClass: "bg-red-100 ring-1 ring-red-200/80",
  },
};

export function getNotificationVisual(
  typeValue: string | null | undefined,
): NotificationVisual {
  if (typeValue && typeValue in NOTIFICATION_VISUALS) {
    return NOTIFICATION_VISUALS[typeValue as NotificationTypeValue];
  }
  return NOTIFICATION_VISUALS.CUSTOM;
}

/** Combined chip classes for icon containers (backward-compatible helper). */
export function getNotificationVisualColorClass(
  typeValue: string | null | undefined,
): string {
  const visual = getNotificationVisual(typeValue);
  return `${visual.iconClass} ${visual.chipClass}`;
}

export function getNotificationUserLabel(user: {
  fullName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  id: number;
}): string {
  return user.fullName || user.phoneNumber || user.email || `#${user.id}`;
}
