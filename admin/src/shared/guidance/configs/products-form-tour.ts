import { defaultFormTour } from "@/shared/guidance/configs/create-crud-guidance";
import {
  CRUD_FORM_DRAWER_ANCHORS,
  CRUD_FORM_FIELD_ANCHORS,
  PRODUCT_FORM_ANCHORS,
} from "@/shared/guidance/constants/guidance.constants";
import type { TourStepDef } from "@/shared/guidance/types/guidance.types";

/** Short wait after tab switches — long waits freeze the previous step and feel stuck. */
const TAB_WAIT_MS = 1500;

/** Tab-aware create/edit tour for Products. */
export function productsFormTour(): TourStepDef[] {
  return [
    {
      id: "form-drawer",
      anchor: CRUD_FORM_DRAWER_ANCHORS.panel,
      title: "Add product",
      description: "Use this side panel to create or edit a product. Work through the tabs from left to right.",
      side: "left",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "product-tabs",
      anchor: PRODUCT_FORM_ANCHORS.tabs,
      title: "Product tabs",
      description:
        "General, Content, Media, and Attributes (plus Options & Stock for variant products). Switch tabs to complete each section.",
      side: "bottom",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "product-tab-general",
      anchor: PRODUCT_FORM_ANCHORS.tabGeneral,
      title: "General",
      description: "Brand, categories, tags, product type, and expiry dates live here.",
      side: "bottom",
      align: "start",
      clickToActivate: true,
      skipIfMissing: true,
    },
    {
      id: "product-type",
      anchor: PRODUCT_FORM_ANCHORS.type,
      title: "Product type",
      description:
        "Choose Simple for one SKU, or Variant to unlock the Options & Stock tab for multiple options.",
      side: "left",
      align: "start",
      waitForElement: TAB_WAIT_MS,
      skipIfMissing: true,
    },
    {
      id: "product-visibility",
      anchor: PRODUCT_FORM_ANCHORS.visibility,
      title: "Visibility toggles",
      description:
        "Publish to show on the storefront. Featured, Best seller, Newly arrived, and other flags control merchandising badges — click to turn each on or off.",
      side: "left",
      align: "start",
      skipIfMissing: true,
    },
    {
      id: "product-tab-content",
      anchor: PRODUCT_FORM_ANCHORS.tabContent,
      title: "Content",
      description: "Add English and Arabic titles and descriptions for the storefront.",
      side: "bottom",
      align: "start",
      clickToActivate: true,
      skipIfMissing: true,
    },
    {
      id: "product-content",
      anchor: PRODUCT_FORM_ANCHORS.content,
      title: "Titles & copy",
      description: "Fill both languages when possible so customers see the right content.",
      side: "left",
      align: "start",
      waitForElement: TAB_WAIT_MS,
      skipIfMissing: true,
    },
    {
      id: "product-tab-media",
      anchor: PRODUCT_FORM_ANCHORS.tabMedia,
      title: "Media",
      description: "Upload product images (required) and an optional video.",
      side: "bottom",
      align: "start",
      clickToActivate: true,
      skipIfMissing: true,
    },
    {
      id: "product-media",
      anchor: PRODUCT_FORM_ANCHORS.media,
      title: "Images",
      description: "Add at least one image before saving a new product.",
      side: "left",
      align: "start",
      waitForElement: TAB_WAIT_MS,
      skipIfMissing: true,
    },
    {
      id: "product-tab-attributes",
      anchor: PRODUCT_FORM_ANCHORS.tabAttributes,
      title: "Attributes",
      description: "Set SKU, price, and stock for simple products, or choose attributes for variants.",
      side: "bottom",
      align: "start",
      clickToActivate: true,
      skipIfMissing: true,
    },
    {
      id: "product-attributes",
      anchor: PRODUCT_FORM_ANCHORS.attributes,
      title: "Inventory & attributes",
      description: "Enter pricing and stock here, then attach attributes as needed.",
      side: "left",
      align: "start",
      waitForElement: TAB_WAIT_MS,
      skipIfMissing: true,
    },
    {
      id: "form-actions",
      anchor: CRUD_FORM_FIELD_ANCHORS.actions,
      title: "Save product",
      description: "When every required tab is complete, save to create the product — or cancel to discard.",
      side: "top",
      align: "end",
      skipIfMissing: true,
    },
  ];
}

/** Brands / categories keep the shared drawer tour (includes visibility + save). */
export function standardEntityFormTour(): TourStepDef[] {
  return defaultFormTour();
}
