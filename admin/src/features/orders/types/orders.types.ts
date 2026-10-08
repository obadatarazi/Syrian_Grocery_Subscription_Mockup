export type EnumLabelValue = {
  label: string | null;
  value: string | null;
};

export type OrderUserRef = {
  id: number;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
  avatarFileUrl?: string | null;
};

export type OrderDeliveryZonePriceRef = {
  id: number;
  deliveryFee: number;
  state?: {
    id: number;
    title: string;
  } | null;
};

export type OrderAddress = {
  title?: string | null;
  phoneNumber?: string | null;
  streetTitle?: string | null;
  building?: string | null;
  floorNumber?: string | null;
  apartment?: string | null;
  landmark?: string | null;
  longitude?: string | null;
  latitude?: string | null;
};

export type OrderItem = {
  id: number;
  orderId?: number;
  orderRefNumber?: string | null;
  productId?: number | null;
  productVariantId?: number | null;
  productTitle?: string | null;
  price: number;
  quantity: number;
  subTotalPrice: number;
};

export type OrderInvoicePaymentProviderRef = {
  id: number;
  title?: string;
  standard?: boolean;
  imageFileUrl?: string | null;
  type?: EnumLabelValue | null;
};

export type OrderPackingSlipDownload = {
  fileName: string;
  fileUrl: string;
  downloadUrl: string;
};

export type OrderInvoice = {
  id?: number;
  invoiceNumber?: string | null;
  orderId?: number;
  orderRefNumber?: string | null;
  paymentProviderId?: number | null;
  currencyId?: number | null;
  currencyCode?: string | null;
  currency?: {
    id: number;
    title: string;
    symbol: string;
  } | null;
  status?: EnumLabelValue | null;
  paymentProviderType?: EnumLabelValue | null;
  /** Slim order list may send a single locale title instead of nested provider. */
  paymentProviderTitle?: string | null;
  paymentProvider?: OrderInvoicePaymentProviderRef | null;
  totalPrice?: number;
  paymentMethod?: string | null;
  paidAt?: string | null;
  providerInvoiceId?: string | null;
  paymentUrl?: string | null;
};

/**
 * Order list rows are slim (summary fields + itemsCount). Details fields
 * (items, address, deliveryZonePrice, deliveryFeePrice, …) arrive only from getById.
 */
export type Order = {
  id: number;
  orderRefNumber: string;
  orderUuid?: string;
  user?: OrderUserRef | null;
  userAddressId?: number | null;
  deliveryZonePrice?: OrderDeliveryZonePriceRef | null;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: OrderAddress | null;
  /** Details-only — absent on slim list rows. */
  deliveryFeePrice?: number;
  commissionTaxRate?: string | null;
  commissionTaxPrice?: number | null;
  totalPrice: number;
  totalPriceWithTax?: number | null;
  hasDiscount?: boolean;
  status?: EnumLabelValue | null;
  createdBy?: EnumLabelValue | null;
  createdByAdmin?: OrderUserRef | null;
  itemsCount?: number;
  /** Details-only — use itemsCount on list. */
  items?: OrderItem[];
  invoice?: OrderInvoice | null;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderListParams = {
  page?: number;
  limit?: number;
  search?: string;
  userId?: number;
  orderRefNumber?: string;
  status?: string;
  createdBy?: string;
  hasDiscount?: boolean;
  invoiceStatus?: string;
  paymentProvider?: string;
  sort?: string;
  direction?: "asc" | "desc";
};

export type OrderLineItemFormData = {
  key: string;
  productId: number | null;
  productVariantId: number | null;
  quantity: number;
};

export type OrderFormData = {
  userId: number | null;
  userAddressId: number | null;
  deliveryZonePriceId: number | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  addressTitle: string;
  addressPhoneNumber: string;
  addressStreetTitle: string;
  addressBuilding: string;
  addressFloorNumber: string;
  addressApartment: string;
  addressLandmark: string;
  addressLongitude: string;
  addressLatitude: string;
  currencyId: number | null;
  status?: string;
  items: OrderLineItemFormData[];
};

export type OrderListResult = import("@/shared/types").PaginatedResult<Order>;

let lineItemKey = 0;

export function createEmptyOrderLineItem(): OrderLineItemFormData {
  lineItemKey += 1;
  return {
    key: `line-${lineItemKey}`,
    productId: null,
    productVariantId: null,
    quantity: 1,
  };
}

export function createEmptyOrderForm(): OrderFormData {
  return {
    userId: null,
    userAddressId: null,
    deliveryZonePriceId: null,
    fullName: "",
    email: "",
    phoneNumber: "",
    addressTitle: "",
    addressPhoneNumber: "",
    addressStreetTitle: "",
    addressBuilding: "",
    addressFloorNumber: "",
    addressApartment: "",
    addressLandmark: "",
    addressLongitude: "",
    addressLatitude: "",
    currencyId: null,
    status: undefined,
    items: [createEmptyOrderLineItem()],
  };
}

export function orderToFormData(order: Order): OrderFormData {
  return {
    userId: order.user?.id ?? null,
    userAddressId: order.userAddressId ?? null,
    deliveryZonePriceId: order.deliveryZonePrice?.id ?? null,
    fullName: order.fullName ?? "",
    email: order.email ?? "",
    phoneNumber: order.phoneNumber ?? "",
    addressTitle: order.address?.title ?? "",
    addressPhoneNumber: order.address?.phoneNumber ?? "",
    addressStreetTitle: order.address?.streetTitle ?? "",
    addressBuilding: order.address?.building ?? "",
    addressFloorNumber: order.address?.floorNumber ?? "",
    addressApartment: order.address?.apartment ?? "",
    addressLandmark: order.address?.landmark ?? "",
    addressLongitude: order.address?.longitude ?? "",
    addressLatitude: order.address?.latitude ?? "",
    currencyId: order.invoice?.currencyId ?? null,
    status: order.status?.value ?? undefined,
    items:
      order.items && order.items.length > 0
        ? order.items.map((item) => {
            lineItemKey += 1;
            return {
              key: `line-${lineItemKey}`,
              productId: item.productId ?? null,
              productVariantId: item.productVariantId ?? null,
              quantity: item.quantity,
            };
          })
        : [createEmptyOrderLineItem()],
  };
}

function optionalTrimmed(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function buildOrderCreatePayload(data: OrderFormData): Record<string, unknown> {
  const items = data.items
    .map((item) => {
      if (item.productVariantId) {
        return {
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        };
      }
      if (item.productId) {
        return {
          productId: item.productId,
          quantity: item.quantity,
        };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  return {
    deliveryZonePriceId: data.deliveryZonePriceId,
    userId: data.userId ?? undefined,
    userAddressId: data.userAddressId ?? undefined,
    fullName: optionalTrimmed(data.fullName),
    email: optionalTrimmed(data.email),
    phoneNumber: optionalTrimmed(data.phoneNumber),
    addressTitle: optionalTrimmed(data.addressTitle),
    addressPhoneNumber: optionalTrimmed(data.addressPhoneNumber),
    addressStreetTitle: optionalTrimmed(data.addressStreetTitle),
    addressBuilding: optionalTrimmed(data.addressBuilding),
    addressFloorNumber: optionalTrimmed(data.addressFloorNumber),
    addressApartment: optionalTrimmed(data.addressApartment),
    addressLandmark: optionalTrimmed(data.addressLandmark),
    addressLongitude: optionalTrimmed(data.addressLongitude),
    addressLatitude: optionalTrimmed(data.addressLatitude),
    currencyId: data.currencyId ?? undefined,
    items,
  };
}

export function buildOrderUpdatePayload(
  original: OrderFormData,
  current: OrderFormData,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (current.status && current.status !== original.status) {
    payload.status = current.status;
  }

  const scalarKeys = [
    "fullName",
    "email",
    "phoneNumber",
    "addressTitle",
    "addressPhoneNumber",
    "addressStreetTitle",
    "addressBuilding",
    "addressFloorNumber",
    "addressApartment",
    "addressLandmark",
    "addressLongitude",
    "addressLatitude",
  ] as const;

  for (const key of scalarKeys) {
    if (current[key].trim() !== original[key].trim()) {
      payload[key] = optionalTrimmed(current[key]) ?? null;
    }
  }

  if (current.deliveryZonePriceId !== original.deliveryZonePriceId) {
    payload.deliveryZonePriceId = current.deliveryZonePriceId;
  }
  if (current.userId !== original.userId) {
    payload.userId = current.userId;
  }
  if (current.userAddressId !== original.userAddressId) {
    payload.userAddressId = current.userAddressId;
  }
  if (current.currencyId !== original.currencyId) {
    payload.currencyId = current.currencyId;
  }

  const itemsChanged =
    current.items.length !== original.items.length ||
    current.items.some((item, index) => {
      const prev = original.items[index];
      return (
        !prev ||
        item.productId !== prev.productId ||
        item.productVariantId !== prev.productVariantId ||
        item.quantity !== prev.quantity
      );
    });

  if (itemsChanged) {
    payload.items = buildOrderCreatePayload(current).items;
  }

  return payload;
}

export function hasOrderFormChanges(original: OrderFormData, current: OrderFormData): boolean {
  return Object.keys(buildOrderUpdatePayload(original, current)).length > 0;
}
