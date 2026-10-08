import { type RouteObject } from "react-router";

import { RouteSuspense } from "@/app/components/RouteSuspense";
import { AdminDashboardLayout } from "@/app/layouts/AdminDashboardLayout";
import { ProtectedRoute } from "@/app/router/guards/ProtectedRoute";
import {
  LazyBrandsPage,
  LazyCategoriesPage,
  LazyCountriesPage,
  LazyCurrenciesPage,
  LazyCustomersPage,
  LazyCustomerCrmPage,
  LazyDashboardHomePage,
  LazyDeliveryZonesPricesPage,
  LazyDesignSystemPage,
  LazyDiscountsPage,
  LazyInventoryPage,
  LazyInvoicesPage,
  LazyNotificationsPage,
  LazyOrderItemsPage,
  LazyOrdersPage,
  LazyPaymentProvidersPage,
  LazyPlatformNotificationsPage,
  LazyPrescriptionsPage,
  LazyProductsPage,
  LazyProductSaleDiscountDemoPage,
  LazyProductReviewsPage,
  LazyProfilePage,
  LazyPromotionsPage,
  LazyReportsPage,
  LazyRolesPage,
  LazyContactUsPage,
  LazySettingsPage,
  LazyVisualSettingsPage,
  LazySliderPromotionsPage,
  LazySlidersPage,
  LazyStaticPromotionsPage,
  LazyStatesPage,
  LazyTagsPage,
  LazyAttributesPage,
  LazyAttributeValuesPage,
  LazyUsersPage,
  LazyFulfilmentPage,
  LazyDispatchPage,
} from "@/app/router/lazy-pages";

export const protectedRoutes: RouteObject[] = [
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <AdminDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <RouteSuspense>
            <LazyDashboardHomePage />
          </RouteSuspense>
        ),
      },
      {
        path: "orders",
        element: (
          <RouteSuspense>
            <LazyOrdersPage />
          </RouteSuspense>
        ),
      },
      {
        path: "invoices",
        element: (
          <RouteSuspense>
            <LazyInvoicesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "order-items",
        element: (
          <RouteSuspense>
            <LazyOrderItemsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "products",
        element: (
          <RouteSuspense>
            <LazyProductsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "product-reviews",
        element: (
          <RouteSuspense>
            <LazyProductReviewsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "categories",
        element: (
          <RouteSuspense>
            <LazyCategoriesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "brands",
        element: (
          <RouteSuspense>
            <LazyBrandsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "countries",
        element: (
          <RouteSuspense>
            <LazyCountriesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "states",
        element: (
          <RouteSuspense>
            <LazyStatesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "currencies",
        element: (
          <RouteSuspense>
            <LazyCurrenciesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "payment-providers",
        element: (
          <RouteSuspense>
            <LazyPaymentProvidersPage />
          </RouteSuspense>
        ),
      },
      {
        path: "delivery-zones-prices",
        element: (
          <RouteSuspense>
            <LazyDeliveryZonesPricesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "tags",
        element: (
          <RouteSuspense>
            <LazyTagsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "attributes",
        element: (
          <RouteSuspense>
            <LazyAttributesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "attribute-values",
        element: (
          <RouteSuspense>
            <LazyAttributeValuesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "customers",
        element: (
          <RouteSuspense>
            <LazyCustomersPage />
          </RouteSuspense>
        ),
      },
      {
        path: "customers/:id",
        element: (
          <RouteSuspense>
            <LazyCustomerCrmPage />
          </RouteSuspense>
        ),
      },
      {
        path: "users",
        element: (
          <RouteSuspense>
            <LazyUsersPage />
          </RouteSuspense>
        ),
      },
      {
        path: "profile",
        element: (
          <RouteSuspense>
            <LazyProfilePage />
          </RouteSuspense>
        ),
      },
      {
        path: "prescriptions",
        element: (
          <RouteSuspense>
            <LazyPrescriptionsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "inventory",
        element: (
          <RouteSuspense>
            <LazyInventoryPage />
          </RouteSuspense>
        ),
      },
      {
        path: "promotions",
        element: (
          <RouteSuspense>
            <LazyPromotionsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "discounts",
        element: (
          <RouteSuspense>
            <LazyDiscountsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "product-sale-demo",
        element: (
          <RouteSuspense>
            <LazyProductSaleDiscountDemoPage />
          </RouteSuspense>
        ),
      },
      {
        path: "sliders",
        element: (
          <RouteSuspense>
            <LazySlidersPage />
          </RouteSuspense>
        ),
      },
      {
        path: "slider-promotions",
        element: (
          <RouteSuspense>
            <LazySliderPromotionsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "static-promotions",
        element: (
          <RouteSuspense>
            <LazyStaticPromotionsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <RouteSuspense>
            <LazyNotificationsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "platform-notifications",
        element: (
          <RouteSuspense>
            <LazyPlatformNotificationsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "reports",
        element: (
          <RouteSuspense>
            <LazyReportsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "settings",
        element: (
          <RouteSuspense>
            <LazySettingsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "visual-settings",
        element: (
          <RouteSuspense>
            <LazyVisualSettingsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "contact-us",
        element: (
          <RouteSuspense>
            <LazyContactUsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "roles",
        element: (
          <RouteSuspense>
            <LazyRolesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "design-system",
        element: (
          <RouteSuspense>
            <LazyDesignSystemPage />
          </RouteSuspense>
        ),
      },
      {
        path: "fulfilment",
        element: (
          <RouteSuspense>
            <LazyFulfilmentPage />
          </RouteSuspense>
        ),
      },
      {
        path: "dispatch",
        element: (
          <RouteSuspense>
            <LazyDispatchPage />
          </RouteSuspense>
        ),
      },
    ],
  },
];
