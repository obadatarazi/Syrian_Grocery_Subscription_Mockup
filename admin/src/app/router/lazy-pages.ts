import { lazy } from "react";

export const LazyLoginPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.LoginPage })),
);

export const LazyForgotPasswordPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.ForgotPasswordPage })),
);

export const LazyResetPasswordPage = lazy(() =>
  import("@/features/auth").then((module) => ({ default: module.ResetPasswordPage })),
);

export const LazyDashboardHomePage = lazy(() =>
  import("@/features/dashboard").then((module) => ({ default: module.DashboardHomePage })),
);

export const LazyOrdersPage = lazy(() =>
  import("@/features/orders").then((module) => ({ default: module.OrdersPage })),
);

export const LazyInvoicesPage = lazy(() =>
  import("@/features/invoices").then((module) => ({ default: module.InvoicesPage })),
);

export const LazyOrderItemsPage = lazy(() =>
  import("@/features/order-items").then((module) => ({ default: module.OrderItemsPage })),
);

export const LazyProductsPage = lazy(() =>
  import("@/features/grocery-products").then((module) => ({
    default: module.GroceryProductsPage,
  })),
);

export const LazyProductSaleDiscountDemoPage = lazy(() =>
  import("@/features/products").then((module) => ({
    default: module.ProductSaleDiscountDemoPage,
  })),
);

export const LazyProductReviewsPage = lazy(() =>
  import("@/features/product-reviews").then((module) => ({ default: module.ProductReviewsPage })),
);

export const LazyBrandsPage = lazy(() =>
  import("@/features/brands").then((module) => ({ default: module.BrandsPage })),
);

export const LazyCountriesPage = lazy(() =>
  import("@/features/countries").then((module) => ({ default: module.CountriesPage })),
);

export const LazyStatesPage = lazy(() =>
  import("@/features/states").then((module) => ({ default: module.StatesPage })),
);

export const LazyCurrenciesPage = lazy(() =>
  import("@/features/currencies").then((module) => ({ default: module.CurrenciesPage })),
);

export const LazyDiscountsPage = lazy(() =>
  import("@/features/discounts").then((module) => ({ default: module.DiscountsPage })),
);

export const LazyPaymentProvidersPage = lazy(() =>
  import("@/features/payment-providers").then((module) => ({
    default: module.PaymentProvidersPage,
  })),
);

export const LazyDeliveryZonesPricesPage = lazy(() =>
  import("@/features/delivery-zones-prices").then((module) => ({
    default: module.DeliveryZonesPricesPage,
  })),
);

export const LazyTagsPage = lazy(() =>
  import("@/features/tags").then((module) => ({ default: module.TagsPage })),
);

export const LazyAttributesPage = lazy(() =>
  import("@/features/attributes").then((module) => ({ default: module.AttributesPage })),
);

export const LazyAttributeValuesPage = lazy(() =>
  import("@/features/attribute-values").then((module) => ({ default: module.AttributeValuesPage })),
);

export const LazyUsersPage = lazy(() =>
  import("@/features/users").then((module) => ({ default: module.UsersPage })),
);

export const LazyProfilePage = lazy(() =>
  import("@/features/profile").then((module) => ({ default: module.ProfilePage })),
);

export const LazyCategoriesPage = lazy(() =>
  import("@/features/categories").then((module) => ({ default: module.CategoriesPage })),
);

export const LazyCustomersPage = lazy(() =>
  import("@/features/customers").then((module) => ({ default: module.CustomersPage })),
);

export const LazyCustomerCrmPage = lazy(() =>
  import("@/features/customers").then((module) => ({ default: module.CustomerCrmPage })),
);

export const LazyPrescriptionsPage = lazy(() =>
  import("@/features/prescriptions").then((module) => ({ default: module.PrescriptionsPage })),
);

export const LazyInventoryPage = lazy(() =>
  import("@/features/inventory").then((module) => ({ default: module.InventoryPage })),
);

export const LazyPromotionsPage = lazy(() =>
  import("@/features/promotions").then((module) => ({ default: module.PromotionsPage })),
);

export const LazySlidersPage = lazy(() =>
  import("@/features/sliders").then((module) => ({ default: module.SlidersPage })),
);

export const LazySliderPromotionsPage = lazy(() =>
  import("@/features/slider-promotions").then((module) => ({ default: module.SliderPromotionsPage })),
);

export const LazyStaticPromotionsPage = lazy(() =>
  import("@/features/static-promotions").then((module) => ({ default: module.StaticPromotionsPage })),
);

export const LazyNotificationsPage = lazy(() =>
  import("@/features/notifications").then((module) => ({ default: module.NotificationsPage })),
);

export const LazyPlatformNotificationsPage = lazy(() =>
  import("@/features/notifications").then((module) => ({
    default: module.PlatformNotificationsPage,
  })),
);

export const LazyReportsPage = lazy(() =>
  import("@/features/reports").then((module) => ({ default: module.ReportsPage })),
);

export const LazySettingsPage = lazy(() =>
  import("@/features/settings").then((module) => ({ default: module.SettingsPage })),
);

export const LazyVisualSettingsPage = lazy(() =>
  import("@/features/visual-settings").then((module) => ({ default: module.VisualSettingsPage })),
);

export const LazyContactUsPage = lazy(() =>
  import("@/features/contact-us").then((module) => ({ default: module.ContactUsPage })),
);

export const LazyRolesPage = lazy(() =>
  import("@/features/roles").then((module) => ({ default: module.RolesPage })),
);

export const LazyDesignSystemPage = lazy(() =>
  import("@/features/design-system").then((module) => ({ default: module.DesignSystemPage })),
);

export const LazyFulfilmentPage = lazy(() =>
  import("@/features/fulfilment").then((module) => ({ default: module.FulfilmentPage })),
);

export const LazyDispatchPage = lazy(() =>
  import("@/features/dispatch").then((module) => ({ default: module.DispatchPage })),
);
