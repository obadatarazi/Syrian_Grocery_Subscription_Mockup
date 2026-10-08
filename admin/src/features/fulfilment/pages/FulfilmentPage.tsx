import { useMemo, useState } from "react";

import { PageContainer, PageHeader } from "@/shared/components";
import { DemoDataBanner } from "@/shared/demo";
import { FULFILMENT_ORDERS } from "@/features/fulfilment/mocks/fulfilment.mocks";

// Group paid orders for a given date by product and sum quantities
function buildProductSummary(date: string) {
  const paid = FULFILMENT_ORDERS.filter((o) => o.paid && o.date === date);
  const map = new Map<string, { productAr: string; productEn: string; qty: number }>();
  for (const order of paid) {
    for (const item of order.items) {
      const existing = map.get(item.productAr);
      if (existing) {
        existing.qty += item.qty;
      } else {
        map.set(item.productAr, { ...item });
      }
    }
  }
  return Array.from(map.values());
}

function buildOrderList(date: string) {
  return FULFILMENT_ORDERS.filter((o) => o.paid && o.date === date);
}

// Available dates (unique, from mocks)
const AVAILABLE_DATES = [...new Set(FULFILMENT_ORDERS.map((o) => o.date))].sort();

export function FulfilmentPage() {
  const [selectedDate, setSelectedDate] = useState<string>(AVAILABLE_DATES[0] ?? "");

  const productSummary = useMemo(() => buildProductSummary(selectedDate), [selectedDate]);
  const orders = useMemo(() => buildOrderList(selectedDate), [selectedDate]);

  const totalItems = productSummary.reduce((s, p) => s + p.qty, 0);

  return (
    <PageContainer>
      <DemoDataBanner />
      <PageHeader
        title="التجهيز"
        description="طلبات دمشق المدفوعة مجمّعة حسب المنتج لتاريخ التسليم المحدد."
      />

      {/* Date picker */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-foreground">تاريخ التسليم:</label>
        {AVAILABLE_DATES.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              d === selectedDate
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {productSummary.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
          لا توجد طلبات مدفوعة لهذا اليوم.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Summary */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">ملخص المنتجات</h2>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                {totalItems} وحدة إجمالية
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="px-5 py-3 text-start font-medium">المنتج</th>
                  <th className="px-5 py-3 text-end font-bold">الكمية الإجمالية</th>
                </tr>
              </thead>
              <tbody>
                {productSummary.map((p, i) => (
                  <tr
                    key={p.productAr}
                    className={`${i % 2 === 0 ? "" : "bg-muted/20"} border-b border-border/50 last:border-0`}
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{p.productAr}</td>
                    <td className="px-5 py-3 text-end">
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                        {p.qty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order list */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">
                الطلبات المدفوعة ({orders.length})
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {orders.map((order) => (
                <div key={order.id} className="px-5 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-foreground">{order.customerAr}</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {order.id}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">{order.phone}</p>
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li key={item.productAr} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.productAr}</span>
                        <span className="font-medium text-brand">× {item.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
