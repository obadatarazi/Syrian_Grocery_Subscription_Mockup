export type DispatchOrder = {
  id: string;
  customerAr: string;
  customerEn: string;
  phone: string;
  total: number; // SYP
  estimatedDelivery: string; // ISO date
  status: "confirmed" | "dispatched" | "delivered";
  dispatchedAt?: string; // ISO datetime
  deliveredAt?: string; // ISO datetime
};

const today = new Date("2026-10-08");
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r.toISOString().slice(0, 10);
};

export const DISPATCH_ORDERS_SEED: DispatchOrder[] = [
  {
    id: "HSR-1001",
    customerAr: "أحمد الخطيب",
    customerEn: "Ahmad Al-Khatib",
    phone: "0912 345 678",
    total: 12500,
    estimatedDelivery: addDays(today, 0), // today
    status: "confirmed",
  },
  {
    id: "HSR-1002",
    customerAr: "فاطمة السيد",
    customerEn: "Fatima Al-Sayed",
    phone: "0933 222 111",
    total: 9800,
    estimatedDelivery: addDays(today, 0),
    status: "dispatched",
    dispatchedAt: "2026-10-08T09:15:00",
  },
  {
    id: "HSR-1004",
    customerAr: "منى حسن",
    customerEn: "Mona Hassan",
    phone: "0955 666 555",
    total: 21000,
    estimatedDelivery: addDays(today, 1),
    status: "confirmed",
  },
  {
    id: "HSR-1005",
    customerAr: "سامي الرفاعي",
    customerEn: "Sami Al-Rifai",
    phone: "0911 444 333",
    total: 7500,
    estimatedDelivery: addDays(today, -1), // yesterday — late if not delivered
    status: "dispatched",
    dispatchedAt: "2026-10-07T14:00:00",
  },
  {
    id: "HSR-1006",
    customerAr: "نادية البكري",
    customerEn: "Nadia Al-Bakri",
    phone: "0922 777 888",
    total: 15200,
    estimatedDelivery: addDays(today, -2),
    status: "delivered",
    dispatchedAt: "2026-10-06T10:00:00",
    deliveredAt: "2026-10-06T16:30:00",
  },
];
