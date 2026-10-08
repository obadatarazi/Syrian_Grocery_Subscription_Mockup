/**
 * Static Admin copies of Backend PHP enums (OptionController).
 * Labels mirror Backend/lang/{en,ar}/enum.php — plus REVIEWED (missing in lang files).
 */

export type StaticEnumLocale = "en" | "ar";

export type StaticEnumOptionDef = {
  value: string;
  label: Record<StaticEnumLocale, string>;
};

function defs(
  entries: Array<[string, string, string]>,
): StaticEnumOptionDef[] {
  return entries.map(([value, en, ar]) => ({
    value,
    label: { en, ar },
  }));
}

export const STATIC_ENUM_OPTIONS = {
  multiTypeSettingType: defs([
    ["EMAIL", "Email", "بريد إلكتروني"],
    ["LINK", "Link", "رابط"],
    ["NUMBER", "Number", "رقم"],
    ["PHONE_NUMBER", "Phone Number", "رقم هاتف"],
    ["TEXT", "Text", "نص"],
    ["PERCENTAGE", "Percentage", "نسبة مئوية"],
    ["BOOLEAN", "Boolean", "منطقي"],
  ]),
  userGender: defs([
    ["MALE", "Male", "ذكر"],
    ["FEMALE", "Female", "أنثى"],
  ]),
  userType: defs([
    ["ADMIN", "Admin", "مدير"],
    ["CUSTOMER", "Customer", "مستخدم"],
  ]),
  contactUsStatus: defs([
    ["PENDING", "Pending", "قيد الانتظار"],
    ["REVIEWED", "Reviewed", "تمت المراجعة"],
  ]),
  notificationType: defs([
    ["ORDER", "Order", "طلب"],
    ["STOCK", "Stock", "المخزون"],
    ["RX", "Prescription", "وصفة طبية"],
    ["CUSTOMER", "Customer", "مستخدم"],
    ["PAYMENT", "Payment", "دفع"],
    ["PROMO", "Promotion", "عرض ترويجي"],
    ["REVIEW", "Review", "تقييم"],
    ["CUSTOM", "Custom", "مخصص"],
    ["WARNING", "Warning", "تحذير"],
    ["ERROR", "Error", "خطأ"],
  ]),
  staticPromotionType: defs([
    ["MOBILE", "Mobile", "جوال"],
    ["DESKTOP", "Desktop", "سطح المكتب"],
  ]),
  sliderPromotionType: defs([
    ["MOBILE", "Mobile", "جوال"],
    ["DESKTOP", "Desktop", "سطح المكتب"],
  ]),
  productType: defs([
    ["SIMPLE", "Simple", "بسيط"],
    ["VARIABLE_PRODUCT", "Variable Product", "متعدد الخيارات"],
  ]),
  productStatus: defs([
    ["OUT_OF_STOCK", "Out of Stock", "نفذ من المخزون"],
    ["LOW_STOCK", "Low Stock", "مخزون منخفض"],
    ["IN_STOCK", "In Stock", "متوفر"],
  ]),
  orderStatus: defs([
    ["PENDING_PAYMENT", "Pending Payment", "بانتظار الدفع"],
    ["PROCESSING", "Processing", "قيد المعالجة"],
    ["ON_HOLD", "On Hold", "معلق"],
    ["COMPLETED", "Completed", "مكتمل"],
    ["CANCELLED", "Cancelled", "ملغي"],
    ["REFUNDED", "Refunded", "مسترجع"],
    [
      "ON_THE_WAY_TO_DELIVER_TODAY",
      "On the way to deliver today",
      "في الطريق للتوصيل اليوم",
    ],
  ]),
  orderCreatedBy: defs([
    ["CUSTOMER", "Customer", "مستخدم"],
    ["GUEST", "Guest", "زائر"],
    ["ADMIN", "Admin", "مدير"],
  ]),
  invoiceStatus: defs([
    ["PAID", "Paid", "مدفوع"],
    ["UNPAID", "Unpaid", "غير مدفوع"],
    ["FAILED", "Failed", "فشل"],
    ["REFUNDED", "Refunded", "مسترجع"],
    ["CANCELLED", "Cancelled", "ملغي"],
    ["EXPIRED", "Expired", "منتهي الصلاحية"],
  ]),
  invoicePaymentProvider: defs([
    ["CASH_ON_DELIVERY", "Cash on Delivery", "الدفع عند الاستلام"],
    ["MYFATOORAH", "MyFatoorah", "ماي فاتورة"],
  ]),
} as const;

export type StaticEnumOptionsKey = keyof typeof STATIC_ENUM_OPTIONS;

export function resolveStaticEnumOptions(
  key: StaticEnumOptionsKey,
  locale: StaticEnumLocale,
): Array<{ value: string; label: string }> {
  return STATIC_ENUM_OPTIONS[key].map((option) => ({
    value: option.value,
    label: option.label[locale] ?? option.label.en,
  }));
}
