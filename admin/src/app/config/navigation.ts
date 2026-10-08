import {
  ClipboardList,
  ContactRound,
  Grid3X3,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Settings,
  Tag,
  Truck,
  PackageCheck,
  Zap,
} from "lucide-react";

import { ROUTES } from "@/app/router/routes";
import type { Permission } from "@/shared/constants/permissions";
import { getRouteNavAccess } from "@/shared/constants/routePermissions";
import type { Translation } from "@/shared/design-system/localization/locales/en";

export type NavItem = {
  id: string;
  labelKey: keyof Translation;
  href: string;
  icon: LucideIcon;
  badge?: number;
  /** Single permission gate (used when `permissions` is not set). */
  permission?: Permission;
  /** User needs any one of these permissions to see the item. */
  permissions?: Permission[];
  variant?: "default" | "accent";
};

export type NavSection = {
  id: string;
  labelKey: keyof Translation;
  items: NavItem[];
};

export const designSystemNavItem: NavItem = {
  id: "design-system",
  labelKey: "designSystem",
  href: ROUTES.admin.designSystem,
  icon: Zap,
  variant: "accent",
};

export const adminNavigationSections: NavSection[] = [
  {
    id: "overview",
    labelKey: "navSectionOverview",
    items: [
      { id: "dashboard", labelKey: "dashboard", href: ROUTES.admin.root, icon: LayoutDashboard },
      {
        id: "orders",
        labelKey: "orders",
        href: ROUTES.admin.orders,
        icon: ClipboardList,
        ...getRouteNavAccess(ROUTES.admin.orders),
      },
    ],
  },
  {
    id: "operations",
    labelKey: "navSectionOperations",
    items: [
      {
        id: "fulfilment",
        labelKey: "fulfilment",
        href: ROUTES.admin.fulfilment,
        icon: PackageCheck,
      },
      {
        id: "dispatch",
        labelKey: "dispatch",
        href: ROUTES.admin.dispatch,
        icon: Truck,
      },
    ],
  },
  {
    id: "catalog",
    labelKey: "navSectionCatalog",
    items: [
      {
        id: "products",
        labelKey: "products2",
        href: ROUTES.admin.products,
        icon: Package,
        ...getRouteNavAccess(ROUTES.admin.products),
      },
      {
        id: "categories",
        labelKey: "categories",
        href: ROUTES.admin.categories,
        icon: Grid3X3,
        ...getRouteNavAccess(ROUTES.admin.categories),
      },
      {
        id: "brands",
        labelKey: "brands",
        href: ROUTES.admin.brands,
        icon: Tag,
        ...getRouteNavAccess(ROUTES.admin.brands),
      },
    ],
  },
  {
    id: "customers-section",
    labelKey: "navSectionCustomers",
    items: [
      {
        id: "customers",
        labelKey: "customers",
        href: ROUTES.admin.customers,
        icon: ContactRound,
        ...getRouteNavAccess(ROUTES.admin.customers),
      },
    ],
  },
  {
    id: "settings",
    labelKey: "navSectionSettings",
    items: [
      {
        id: "settings",
        labelKey: "settings",
        href: ROUTES.admin.settings,
        icon: Settings,
        ...getRouteNavAccess(ROUTES.admin.settings),
      },
    ],
  },
  {
    id: "developer",
    labelKey: "navSectionDeveloper",
    items: [designSystemNavItem],
  },
];

export const adminNavigation: NavItem[] = adminNavigationSections
  .flatMap((section) => section.items)
  .filter((item) => item.id !== designSystemNavItem.id);
