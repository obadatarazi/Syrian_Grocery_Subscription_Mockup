import { CreditCard } from "lucide-react";

import { FULFILMENT_ORDERS } from "@/features/fulfilment/mocks/fulfilment.mocks";

const unpaidOrders = FULFILMENT_ORDERS.filter((o) => !o.paid);

export function UnpaidOrdersWidget() {
  if (unpaidOrders.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">طلبات غير مدفوعة</h3>
        </div>
        <p className="text-sm text-muted-foreground">لا توجد طلبات غير مدفوعة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-destructive" />
          <h3 className="text-sm font-semibold text-foreground">طلبات غير مدفوعة</h3>
        </div>
        <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {unpaidOrders.length}
        </span>
      </div>
      <ul className="divide-y divide-border/50">
        {unpaidOrders.map((order) => (
          <li key={order.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{order.customerAr}</p>
              <p className="text-xs text-muted-foreground">{order.id} · {order.date}</p>
            </div>
            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
              غير مدفوع
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
