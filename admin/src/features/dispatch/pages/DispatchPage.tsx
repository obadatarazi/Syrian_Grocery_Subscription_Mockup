import { AlertTriangle, CheckCircle2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { type DispatchOrder, DISPATCH_ORDERS_SEED } from "@/features/dispatch/mocks/dispatch.mocks";
import { PageContainer, PageHeader } from "@/shared/components";
import { DemoDataBanner } from "@/shared/demo";

function formatSyp(amount: number) {
  return `${amount.toLocaleString("ar-SY")} ل.س`;
}

function isLate(order: DispatchOrder): boolean {
  const today = new Date("2026-10-08");
  const est = new Date(order.estimatedDelivery);
  if (order.status === "delivered") {
    const deliveredDate = new Date(order.deliveredAt!);
    return deliveredDate > est;
  }
  if (order.status === "dispatched") {
    return today > est;
  }
  return false;
}

const STATUS_LABELS: Record<DispatchOrder["status"], string> = {
  confirmed: "مؤكد",
  dispatched: "تم الإرسال",
  delivered: "تم التوصيل",
};

const STATUS_COLORS: Record<DispatchOrder["status"], string> = {
  confirmed: "bg-blue-100 text-blue-700",
  dispatched: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
};

export function DispatchPage() {
  const [orders, setOrders] = useState<DispatchOrder[]>(() =>
    DISPATCH_ORDERS_SEED.map((o) => ({ ...o })),
  );

  const markDispatched = (id: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "dispatched", dispatchedAt: now } : o,
      ),
    );
    toast.success(`تم إرسال الطلب ${id}`, {
      description: `تم تسجيل وقت الإرسال: ${new Date().toLocaleTimeString("ar-SY")}`,
    });
  };

  const markDelivered = (id: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "delivered", deliveredAt: now } : o,
      ),
    );
    toast.success(`تم توصيل الطلب ${id}`, {
      description: "تم تحديث حالة الطلب إلى «تم التوصيل».",
    });
  };

  const confirmed = orders.filter((o) => o.status === "confirmed");
  const dispatched = orders.filter((o) => o.status === "dispatched");
  const delivered = orders.filter((o) => o.status === "delivered");

  return (
    <PageContainer>
      <DemoDataBanner />
      <PageHeader
        title="الإرسال والتوصيل"
        description="تتبع حالة الطلبات وسجّل الإرسال والتوصيل."
      />

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "مؤكد", count: confirmed.length, color: "text-blue-600 bg-blue-50" },
          { label: "مُرسَل", count: dispatched.length, color: "text-amber-600 bg-amber-50" },
          { label: "مُوصَّل", count: delivered.length, color: "text-green-600 bg-green-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border border-border ${s.color} px-5 py-4`}>
            <p className="text-2xl font-black">{s.count}</p>
            <p className="text-sm font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">جميع الطلبات</h2>
        </div>
        <div className="divide-y divide-border/50">
          {orders.map((order) => {
            const late = isLate(order);
            return (
              <div
                key={order.id}
                className={`flex flex-wrap items-center gap-4 px-5 py-4 ${late ? "bg-destructive/5" : ""}`}
              >
                {/* Order info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{order.customerAr}</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {order.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                    {late && (
                      <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                        <AlertTriangle className="size-3" />
                        متأخر
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.phone} · {formatSyp(order.total)} · تسليم متوقع:{" "}
                    {order.estimatedDelivery}
                  </p>
                  {order.dispatchedAt && (
                    <p className="text-xs text-muted-foreground">
                      أُرسل: {new Date(order.dispatchedAt).toLocaleString("ar-SY")}
                    </p>
                  )}
                  {order.deliveredAt && (
                    <p className="text-xs text-green-700">
                      وُصِّل: {new Date(order.deliveredAt).toLocaleString("ar-SY")}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => markDispatched(order.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
                    >
                      <Truck className="size-3.5" />
                      تعيين كـ «مُرسَل»
                    </button>
                  )}
                  {order.status === "dispatched" && (
                    <button
                      onClick={() => markDelivered(order.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                    >
                      <CheckCircle2 className="size-3.5" />
                      تعيين كـ «مُوصَّل»
                    </button>
                  )}
                  {order.status === "delivered" && (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 className="size-4" />
                      مكتمل
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
