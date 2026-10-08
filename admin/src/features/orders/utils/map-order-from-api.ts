import type {
  Order,
  OrderInvoice,
  OrderInvoicePaymentProviderRef,
} from "@/features/orders/types/orders.types";
import { getTitleFromApiTranslations } from "@/shared/lib/api/normalize-translations.utils";
import { normalizeEnumLabelValue } from "@/shared/lib/api/normalize-enum.utils";

type RawOrderInvoice = Omit<
  OrderInvoice,
  "status" | "paymentProviderType" | "paymentProvider" | "currency"
> & {
  status?: string | OrderInvoice["status"];
  paymentProviderType?: string | OrderInvoice["paymentProviderType"];
  paymentProviderTitle?: string | null;
  paymentProvider?:
    | (OrderInvoicePaymentProviderRef & {
        translations?: unknown;
      })
    | null;
  currency?: {
    id?: number;
    code?: string | null;
    currencyCode?: string | null;
    title?: string;
    symbol?: string;
    translations?: unknown;
  } | null;
};

type RawOrder = Omit<Order, "status" | "createdBy" | "invoice" | "hasDiscount"> & {
  status?: string | Order["status"];
  createdBy?: string | Order["createdBy"];
  hasDiscount?: boolean;
  invoice?: RawOrderInvoice | null;
};

function mapPaymentProvider(
  provider: RawOrderInvoice["paymentProvider"],
  titleFallback?: string | null,
): OrderInvoicePaymentProviderRef | null {
  if (!provider && !titleFallback) return null;
  if (!provider) {
    return { id: 0, title: titleFallback ?? undefined };
  }

  const title =
    provider.title?.trim() ||
    getTitleFromApiTranslations(provider.translations, titleFallback ?? "") ||
    titleFallback ||
    undefined;

  return {
    id: provider.id,
    title,
    standard: provider.standard,
    imageFileUrl: provider.imageFileUrl,
    type: provider.type ? normalizeEnumLabelValue(provider.type) : null,
  };
}

function mapInvoice(invoice: RawOrderInvoice | null | undefined): OrderInvoice | null {
  if (!invoice) return null;

  const paymentProviderType = normalizeEnumLabelValue(invoice.paymentProviderType);
  const paymentProvider = mapPaymentProvider(
    invoice.paymentProvider,
    invoice.paymentProviderTitle,
  );

  const currencyCode =
    invoice.currencyCode ?? invoice.currency?.code ?? invoice.currency?.currencyCode ?? null;
  const currencyTitle =
    invoice.currency?.title?.trim() ||
    getTitleFromApiTranslations(invoice.currency?.translations, "") ||
    currencyCode ||
    "";

  return {
    ...invoice,
    totalPrice: invoice.totalPrice ?? 0,
    status: normalizeEnumLabelValue(invoice.status),
    paymentProviderType,
    paymentProvider,
    currencyCode,
    currency: invoice.currency
      ? {
          id: invoice.currency.id ?? 0,
          title: currencyTitle,
          symbol: invoice.currency.symbol ?? "",
        }
      : null,
  };
}

/** Normalizes Order list (slim strings) and Details (enum objects) into Admin UI shape. */
export function mapOrderFromApi(order: RawOrder): Order {
  return {
    ...order,
    hasDiscount: order.hasDiscount ?? false,
    status: normalizeEnumLabelValue(order.status),
    createdBy: normalizeEnumLabelValue(order.createdBy),
    invoice: mapInvoice(order.invoice),
  };
}

export function getOrderPaymentLabel(order: Order): string | null {
  return (
    order.invoice?.paymentProvider?.title?.trim() ||
    order.invoice?.paymentProviderType?.label?.trim() ||
    order.invoice?.paymentProviderType?.value?.trim() ||
    null
  );
}
