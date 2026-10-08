export const GUIDANCE_STORAGE_VERSION = "v1";
export const GUIDANCE_STORAGE_PREFIX = `aroma-guidance:${GUIDANCE_STORAGE_VERSION}`;
export const GUIDANCE_PANEL_POS_PREFIX = "aroma-guidance-panel-pos:";

export const GUIDANCE_POPOVER_CLASS = "aroma-guidance-popover";

export function pageAnchor(pageId: string, part: string): string {
  return `${pageId}-${part}`;
}

export function createStandardAnchors(pageId: string) {
  return {
    title: pageAnchor(pageId, "title"),
    search: pageAnchor(pageId, "search"),
    filters: pageAnchor(pageId, "filters"),
    add: pageAnchor(pageId, "add"),
    rowActions: pageAnchor(pageId, "row-actions"),
    status: pageAnchor(pageId, "status"),
  } as const;
}

/** Shared anchors on every create/edit AppDrawer (products, brands, roles, …). */
export const CRUD_FORM_DRAWER_ANCHORS = {
  panel: "crud-form-drawer",
  title: "crud-form-drawer-title",
  body: "crud-form-drawer-body",
  footer: "crud-form-drawer-footer",
} as const;

/** Shared anchors inside entity forms (optional — skip if missing). */
export const CRUD_FORM_FIELD_ANCHORS = {
  visibility: "crud-form-visibility",
  actions: "crud-form-actions",
  tabs: "crud-form-tabs",
} as const;

/** Product create/edit form tab + section anchors. */
export const PRODUCT_FORM_ANCHORS = {
  tabs: "product-form-tabs",
  tabGeneral: "product-tab-general",
  tabContent: "product-tab-content",
  tabMedia: "product-tab-media",
  tabAttributes: "product-tab-attributes",
  tabVariants: "product-tab-variants",
  visibility: "product-form-visibility",
  type: "product-form-type",
  content: "product-form-content",
  media: "product-form-media",
  attributes: "product-form-attributes",
} as const;
