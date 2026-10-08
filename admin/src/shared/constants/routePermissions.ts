import { ROUTES } from "@/app/router/routes";
import { PERMISSIONS, type Permission } from "@/shared/constants/permissions";

export type RoutePermissionRule = Permission | Permission[];

/**
 * Single source of truth for admin route authorization.
 *
 * - Entries here are enforced by `ProtectedRoute` (URL access).
 * - Navigation visibility must be derived via `getRouteNavAccess` so sidebar
 *   gates cannot diverge from route gates.
 * - Routes absent from this map require authentication only.
 */
export const ROUTE_PERMISSIONS: Record<string, RoutePermissionRule> = {
  [ROUTES.admin.orders]: PERMISSIONS.MANAGE_ORDER,
  [ROUTES.admin.invoices]: PERMISSIONS.MANAGE_INVOICE,
  [ROUTES.admin.orderItems]: PERMISSIONS.MANAGE_ORDER_ITEM,
  [ROUTES.admin.products]: PERMISSIONS.MANAGE_PRODUCT,
  [ROUTES.admin.inventory]: PERMISSIONS.MANAGE_PRODUCT_INVENTORY,
  [ROUTES.admin.productReviews]: PERMISSIONS.MANAGE_PRODUCT_REVIEW,
  [ROUTES.admin.categories]: PERMISSIONS.MANAGE_CATEGORY,
  [ROUTES.admin.brands]: PERMISSIONS.MANAGE_BRAND,
  [ROUTES.admin.tags]: PERMISSIONS.MANAGE_TAG,
  [ROUTES.admin.attributes]: [PERMISSIONS.MANAGE_ATTRIBUTE, PERMISSIONS.MANAGE_ATTRIBUTE_VALUE],
  [ROUTES.admin.attributeValues]: PERMISSIONS.MANAGE_ATTRIBUTE_VALUE,
  [ROUTES.admin.countries]: PERMISSIONS.MANAGE_COUNTRY,
  [ROUTES.admin.states]: PERMISSIONS.MANAGE_STATE,
  [ROUTES.admin.currencies]: PERMISSIONS.MANAGE_CURRENCY,
  [ROUTES.admin.discounts]: PERMISSIONS.MANAGE_DISCOUNT,
  [ROUTES.admin.paymentProviders]: PERMISSIONS.MANAGE_PAYMENT_PROVIDER,
  [ROUTES.admin.deliveryZonesPrices]: PERMISSIONS.MANAGE_DELIVERY_ZONES_PRICE,
  [ROUTES.admin.customers]: PERMISSIONS.MANAGE_USER,
  [ROUTES.admin.users]: PERMISSIONS.MANAGE_USER,
  [ROUTES.admin.sliders]: PERMISSIONS.MANAGE_SLIDER,
  [ROUTES.admin.sliderPromotions]: PERMISSIONS.MANAGE_SLIDER_PROMOTION,
  [ROUTES.admin.staticPromotions]: PERMISSIONS.MANAGE_STATIC_PROMOTION,
  [ROUTES.admin.notifications]: PERMISSIONS.MANAGE_NOTIFICATION,
  [ROUTES.admin.platformNotifications]: PERMISSIONS.MANAGE_NOTIFICATION,
  [ROUTES.admin.contactUs]: PERMISSIONS.MANAGE_CONTACT_US,
  [ROUTES.admin.settings]: PERMISSIONS.MANAGE_MULTI_TYPE_SETTING,
  [ROUTES.admin.visualSettings]: PERMISSIONS.MANAGE_VISUAL_SETTING,
  [ROUTES.admin.roles]: PERMISSIONS.MANAGE_ROLE,
};

export type RouteNavAccess = {
  permission?: Permission;
  permissions?: Permission[];
};

/** Map a route permission rule into the nav item `permission` / `permissions` shape. */
export function getRouteNavAccess(href: string): RouteNavAccess {
  const rule = ROUTE_PERMISSIONS[href];
  if (!rule) return {};
  if (Array.isArray(rule)) {
    return { permissions: rule };
  }
  return { permission: rule };
}

export function resolveRoutePermission(pathname: string): RoutePermissionRule | null {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return ROUTE_PERMISSIONS[normalized] ?? null;
}
