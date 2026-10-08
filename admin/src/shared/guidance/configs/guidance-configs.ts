import { createCrudGuidance, defaultFormTour } from "@/shared/guidance/configs/create-crud-guidance";
import { productsFormTour } from "@/shared/guidance/configs/products-form-tour";
import { createStandardAnchors } from "@/shared/guidance/constants/guidance.constants";
import type { PageGuidanceConfig } from "@/shared/guidance/types/guidance.types";

function crud(
  pageId: Parameters<typeof createCrudGuidance>[0]["pageId"],
  routePath: string,
  pageTitle: string,
  entityPlural: string,
  extras?: Partial<Parameters<typeof createCrudGuidance>[0]>,
): PageGuidanceConfig {
  return createCrudGuidance({
    pageId,
    routePath,
    copy: { pageTitle, entityPlural },
    ...extras,
  });
}

const anchors = createStandardAnchors("orders");

export const ordersGuidanceConfig: PageGuidanceConfig = createCrudGuidance({
  pageId: "orders",
  routePath: "/admin/orders",
  copy: {
    pageTitle: "Orders",
    entityPlural: "orders",
    workspaceDescription: "Manage customer orders, statuses, and documents from this page.",
    searchDescription: "Find orders quickly by customer name, email, or reference.",
    filtersDescription: "Narrow the list by status and other fields, or open more filters.",
    addTitle: "Create an order",
    addDescription: "Start a new order with customer, products, and delivery details.",
    actionsTitle: "Row actions",
    actionsDescription: "View, edit, or download invoices and packing slips per order.",
  },
  includeStatusStep: true,
  statusStep: {
    id: "status",
    anchor: anchors.status,
    title: "Quick status change",
    description: "Click the status badge to update an order without opening the edit form.",
    side: "bottom",
    align: "start",
    skipIfMissing: true,
  },
  coachMarks: [
    {
      id: "coach-add",
      anchor: anchors.add,
      title: "Add Order",
      description: "Use this when you need to create an order manually.",
      side: "bottom",
      align: "end",
      skipIfMissing: true,
    },
    {
      id: "coach-search",
      anchor: anchors.search,
      title: "Search",
      description: "Type here anytime you need to locate a specific order.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "coach-status",
      anchor: anchors.status,
      title: "Change status",
      description: "Use the status badge dropdown for a one-click status update.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
  ],
  walkthrough: [
    {
      id: "walk-intro",
      title: "Create-order walkthrough",
      description: "We'll guide you through starting a new order. Click Next to begin.",
    },
    {
      id: "walk-add",
      anchor: anchors.add,
      title: "Click Add Order",
      description: "Click the highlighted button to open the create form.",
      side: "bottom",
      align: "end",
      advanceOnClick: true,
      skipIfMissing: true,
    },
    ...defaultFormTour(),
    {
      id: "walk-done",
      title: "Nice work",
      description: "The order form is ready. Fill it in and save when you're done.",
    },
  ],
  checklist: {
    title: "Get started with orders",
    description: "Complete these setup tasks to run orders smoothly.",
    items: [
      { id: "create-order", label: "Create your first order" },
      { id: "delivery-zones", label: "Configure delivery zones" },
      { id: "review-filters", label: "Try status filters" },
      { id: "change-status", label: "Quick-update an order status" },
      { id: "download-docs", label: "Download a packing slip or invoice" },
    ],
  },
  contextualTip: {
    title: "Tip for this page",
    description:
      "Click a status badge to change it instantly, or filter by status to find pending payments.",
  },
  featureDiscovery: {
    title: "What's new: packing slips",
    description: "Download packing slips and invoices from the row actions on each order.",
  },
  autoShowTip: true,
  autoShowFeatureDiscovery: true,
  hotspots: [
    { id: "add-order", label: "Learn about adding orders", anchor: anchors.add },
    { id: "filters", label: "Learn about filters", anchor: anchors.filters },
    { id: "status", label: "Learn about quick status change", anchor: anchors.status },
  ],
});

export const dashboardGuidanceConfig: PageGuidanceConfig = {
  pageId: "dashboard",
  routePath: "/admin",
  anchors: {
    title: "dashboard-title",
    search: "dashboard-search",
    filters: "dashboard-filters",
    add: "dashboard-add",
    rowActions: "dashboard-row-actions",
  },
  autoProductTourOnce: true,
  productTour: [
    {
      id: "welcome",
      anchor: "dashboard-title",
      title: "Welcome to Haseri Admin",
      description:
        "This home view summarizes sales, stock, and work that needs attention. Use Help anytime to replay tours on any page.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "stats",
      anchor: "dashboard-stats",
      title: "Key metrics",
      description: "Track orders, revenue, and operational health at a glance.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "crm",
      anchor: "dashboard-crm",
      title: "CRM snapshot",
      description: "Customer totals, new buyers, Care Plan subscribers, and retention. Click a card to open that CRM segment.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "charts",
      anchor: "dashboard-charts",
      title: "Trends",
      description: "Revenue and category charts show how sales are performing over time.",
      side: "top",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "recent-orders",
      anchor: "dashboard-recent-orders",
      title: "Recent orders",
      description: "Jump into the latest orders from here when something needs fulfillment.",
      side: "top",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "attention",
      anchor: "dashboard-attention",
      title: "Needs attention",
      description: "Low stock and pending prescriptions surface work that may need a quick action.",
      side: "left",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "nav-products",
      anchor: "nav-products",
      title: "Products",
      description: "Open Products from the sidebar to manage catalog, visibility, and inventory.",
      side: "right",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "nav-orders",
      anchor: "nav-orders",
      title: "Orders",
      description: "Open Orders anytime to manage fulfillment and status updates.",
      side: "right",
      align: "start",
      skipIfMissing: true,
    },
  ],
  coachMarks: [
    {
      id: "coach-stats",
      anchor: "dashboard-stats",
      title: "Metrics",
      description: "These cards update as orders and catalog activity change.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "coach-attention",
      anchor: "dashboard-attention",
      title: "Action widgets",
      description: "Check low stock and pending prescriptions regularly.",
      side: "left",
      align: "start",
      skipIfMissing: true,
    },
  ],
  contextualTip: {
    title: "Getting around",
    description: "Use Help in the header to replay this tour or open guidance on any page.",
  },
  autoShowTip: true,
};

export const profileGuidanceConfig: PageGuidanceConfig = {
  pageId: "profile",
  routePath: "/admin/profile",
  anchors: createStandardAnchors("profile"),
  productTour: [
    {
      id: "profile-title",
      anchor: "profile-title",
      title: "Your profile",
      description: "Update your account details and password from this page.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
  ],
};

export const reportsGuidanceConfig: PageGuidanceConfig = {
  pageId: "reports",
  routePath: "/admin/reports",
  anchors: createStandardAnchors("reports"),
  productTour: [
    {
      id: "reports-title",
      anchor: "reports-title",
      title: "Reports",
      description: "Review charts and summaries for business performance.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
  ],
};

export const notificationsGuidanceConfig: PageGuidanceConfig = createCrudGuidance({
  pageId: "notifications",
  routePath: "/admin/notifications",
  copy: {
    pageTitle: "Notifications",
    entityPlural: "notifications",
    workspaceDescription:
      "Your personal admin inbox. Mark items as read — compose platform messages from Platform Notifications.",
  },
});

export const platformNotificationsGuidanceConfig: PageGuidanceConfig = createCrudGuidance({
  pageId: "platform-notifications",
  routePath: "/admin/platform-notifications",
  copy: {
    pageTitle: "Platform Notifications",
    entityPlural: "platform notifications",
    workspaceDescription:
      "Browse and compose platform notifications. Read and delete actions are not available here.",
  },
});


export const designSystemGuidanceConfig: PageGuidanceConfig = {
  pageId: "design-system",
  routePath: "/admin/design-system",
  anchors: createStandardAnchors("design-system"),
  productTour: [
    {
      id: "ds-title",
      anchor: "design-system-title",
      title: "Design system",
      description: "Browse shared UI patterns, including the guidance showcase.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
  ],
};

/** Standard CRUD configs for all list pages (Orders & Products are richer and defined above / below). */
export const productsGuidanceConfig: PageGuidanceConfig = createCrudGuidance({
  pageId: "products",
  routePath: "/admin/products",
  copy: {
    pageTitle: "Products",
    entityPlural: "products",
    workspaceDescription:
      "Manage your catalog — search, filter, import, and edit products. Clickable brand/category chips filter the table; visibility badges publish and flag products instantly.",
    searchDescription: "Find products by name or related fields.",
    filtersDescription: "Narrow by brand, category, badges, and more — or click a brand/category in a row to filter.",
    addTitle: "Add product",
    addDescription: "Create a product or import a CSV from the header actions.",
    actionsTitle: "Row actions",
    actionsDescription:
      "Hover a product name for Edit, Quick edit, Delete, Duplicate, and View on website.",
  },
  includeStatusStep: true,
  statusStep: {
    id: "visibility",
    anchor: "products-status",
    title: "Visibility (clickable)",
    description:
      "Click Active/Inactive to publish or unpublish. Icon chips toggle Featured, Best seller, Newly arrived, and similar flags without opening the form.",
    side: "left",
    align: "start",
    skipIfMissing: true,
  },
  coachMarks: [
    {
      id: "coach-add",
      anchor: "products-add",
      title: "Add or import",
      description: "Add a single product, or use Import when you have a CSV.",
      side: "bottom",
      align: "end",
      skipIfMissing: true,
    },
    {
      id: "coach-visibility",
      anchor: "products-status",
      title: "Quick visibility",
      description: "Click the status badge or icon chips to change storefront visibility instantly.",
      side: "left",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "coach-row-actions",
      anchor: "products-row-actions",
      title: "Row actions",
      description: "Hover the product name to reveal Edit, Quick edit, Duplicate, and more.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "coach-search",
      anchor: "products-search",
      title: "Search",
      description: "Type here anytime to locate a product.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
  ],
  walkthrough: [
    {
      id: "walk-intro",
      title: "Create-product walkthrough",
      description: "We'll open Add product and walk through each form tab. Click Next to begin.",
    },
    {
      id: "walk-add",
      anchor: "products-add",
      title: "Click Add product",
      description: "Click the highlighted button to open the create form.",
      side: "bottom",
      align: "end",
      advanceOnClick: true,
      skipIfMissing: true,
    },
    ...productsFormTour(),
    {
      id: "walk-done",
      title: "Nice work",
      description: "Finish the remaining fields and save when you are ready.",
    },
  ],
  formTour: productsFormTour(),
  checklist: {
    title: "Get started with products",
    description: "Complete these tasks to manage the catalog confidently.",
    items: [
      { id: "create-first", label: "Create your first product" },
      { id: "try-search", label: "Try the search field" },
      { id: "try-filters", label: "Try filters or sorting" },
      { id: "try-visibility", label: "Toggle a visibility badge" },
      { id: "try-quick-edit", label: "Open Quick edit on a product" },
    ],
  },
  contextualTip: {
    title: "Tip for products",
    description:
      "Click a brand or category in a row to filter the table. Use visibility badges for one-click publish and merchandising flags.",
  },
  featureDiscovery: {
    title: "What's new: quick visibility",
    description:
      "Publish and merchandising flags are clickable in the Visibility column — no need to open the full form.",
  },
  autoShowTip: true,
  autoShowFeatureDiscovery: true,
  hotspots: [
    { id: "add-product", label: "Learn about adding products", anchor: "products-add" },
    { id: "visibility", label: "Learn about visibility toggles", anchor: "products-status" },
    { id: "row-actions", label: "Learn about row actions", anchor: "products-row-actions" },
  ],
});

export const crudGuidanceConfigs: PageGuidanceConfig[] = [
  crud("invoices", "/admin/invoices", "Invoices", "invoices"),
  crud("order-items", "/admin/order-items", "Order items", "order items"),
  // products defined separately as productsGuidanceConfig
  crud("product-reviews", "/admin/product-reviews", "Product reviews", "product reviews"),
  crud("categories", "/admin/categories", "Categories", "categories"),
  crud("brands", "/admin/brands", "Brands", "brands"),
  crud("countries", "/admin/countries", "Countries", "countries"),
  crud("states", "/admin/states", "States", "states"),
  crud("currencies", "/admin/currencies", "Currencies", "currencies"),
  crud("discounts", "/admin/discounts", "Discounts", "discounts"),
  crud("payment-providers", "/admin/payment-providers", "Payment providers", "payment providers"),
  crud(
    "delivery-zones-prices",
    "/admin/delivery-zones-prices",
    "Delivery zone prices",
    "delivery zone prices",
  ),
  crud("tags", "/admin/tags", "Tags", "tags"),
  crud("attributes", "/admin/attributes", "Attributes", "attributes"),
  crud("attribute-values", "/admin/attribute-values", "Attribute values", "attribute values"),
  crud("customers", "/admin/customers", "Customers", "customers"),
  crud("users", "/admin/users", "Users", "users"),
  crud("prescriptions", "/admin/prescriptions", "Prescriptions", "prescriptions"),
  crud("inventory", "/admin/inventory", "Inventory", "inventory"),
  crud("promotions", "/admin/promotions", "Promotions", "promotions"),
  crud("sliders", "/admin/sliders", "Sliders", "sliders"),
  crud("slider-promotions", "/admin/slider-promotions", "Slider promotions", "slider promotions"),
  crud(
    "static-promotions",
    "/admin/static-promotions",
    "Static promotions",
    "static promotions",
  ),
  crud("settings", "/admin/settings", "Settings", "settings"),
  crud("visual-settings", "/admin/visual-settings", "Visual settings", "visual settings"),
  crud("contact-us", "/admin/contact-us", "Contact us", "contact messages"),
  crud("roles", "/admin/roles", "Roles", "roles"),
];

export const allGuidanceConfigs: PageGuidanceConfig[] = [
  dashboardGuidanceConfig,
  ordersGuidanceConfig,
  productsGuidanceConfig,
  ...crudGuidanceConfigs,
  profileGuidanceConfig,
  reportsGuidanceConfig,
  notificationsGuidanceConfig,
  platformNotificationsGuidanceConfig,
  designSystemGuidanceConfig,
];
