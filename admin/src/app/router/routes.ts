export const ROUTES = {
  root: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  notAuthorized: "/not-authorized",
  admin: {
    root: "/admin",
    orders: "/admin/orders",
    invoices: "/admin/invoices",
    orderItems: "/admin/order-items",
    products: "/admin/products",
    productSaleDemo: "/admin/product-sale-demo",
    productReviews: "/admin/product-reviews",
    categories: "/admin/categories",
    brands: "/admin/brands",
    countries: "/admin/countries",
    states: "/admin/states",
    currencies: "/admin/currencies",
    discounts: "/admin/discounts",
    paymentProviders: "/admin/payment-providers",

    deliveryZonesPrices: "/admin/delivery-zones-prices",
    tags: "/admin/tags",
    attributes: "/admin/attributes",
    attributeValues: "/admin/attribute-values",
    customers: "/admin/customers",
    users: "/admin/users",
    profile: "/admin/profile",
    prescriptions: "/admin/prescriptions",
    inventory: "/admin/inventory",
    promotions: "/admin/promotions",
    sliders: "/admin/sliders",
    sliderPromotions: "/admin/slider-promotions",
    staticPromotions: "/admin/static-promotions",
    notifications: "/admin/notifications",
    platformNotifications: "/admin/platform-notifications",
    reports: "/admin/reports",
    settings: "/admin/settings",
    visualSettings: "/admin/visual-settings",
    contactUs: "/admin/contact-us",
    roles: "/admin/roles",
    designSystem: "/admin/design-system",
    fulfilment: "/admin/fulfilment",
    dispatch: "/admin/dispatch",
  },
} as const;

export function customerCrmPath(id: number | string): string {
  return `${ROUTES.admin.customers}/${id}`;
}

export type AdminRouteKey = keyof Omit<typeof ROUTES.admin, "root">;

export const ADMIN_PLACEHOLDER_ROUTES = [
  { path: "products", route: ROUTES.admin.products },
  { path: "categories", route: ROUTES.admin.categories },
  { path: "customers", route: ROUTES.admin.customers },
  { path: "prescriptions", route: ROUTES.admin.prescriptions },
  { path: "inventory", route: ROUTES.admin.inventory },
  { path: "promotions", route: ROUTES.admin.promotions },
  { path: "sliders", route: ROUTES.admin.sliders },
  { path: "slider-promotions", route: ROUTES.admin.sliderPromotions },
  { path: "static-promotions", route: ROUTES.admin.staticPromotions },
  { path: "reports", route: ROUTES.admin.reports },
  { path: "settings", route: ROUTES.admin.settings },
] as const;
