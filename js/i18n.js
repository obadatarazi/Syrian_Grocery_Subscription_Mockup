// Haseri (حصري) — Internationalization
// Handles language toggle and RTL/LTR switching.

const translations = {
  // Navigation
  "nav_home": { ar: "الرئيسية", en: "Home" },
  "nav_catalog": { ar: "الكتالوج", en: "Catalog" },
  "nav_signup": { ar: "تسجيل الاشتراك", en: "Sign Up" },
  "nav_subscribe": { ar: "اشترك", en: "Subscribe" },
  "nav_cart": { ar: "السلة", en: "Cart" },
  "nav_orders": { ar: "الطلبات", en: "Orders" },
  "nav_order_history": { ar: "سجل الطلبات", en: "Order History" },
  "nav_account": { ar: "الحساب", en: "Account" },
  "nav_admin": { ar: "لوحة الإدارة", en: "Admin Dashboard" },
  "nav_fulfilment": { ar: "التجهيز", en: "Fulfilment" },
  "nav_dispatch": { ar: "التوزيع", en: "Dispatch" },
  "nav_products": { ar: "إدارة المنتجات", en: "Products" },

  // Home
  "home_hero_title": { ar: "أسعار الجملة لكل عائلة سورية", en: "Wholesale Prices for Every Syrian Family" },
  "home_hero_subtitle": { ar: "اشترك بـ 5$ شهرياً واحصل على أسعار المصنع", en: "Subscribe for $5/month and get factory-direct prices" },
  "home_hero_cta": { ar: "تصفح الكتالوج", en: "Browse Catalog" },
  "home_hero_signup": { ar: "اشترك الآن", en: "Sign Up Now" },
  "home_features_title": { ar: "لماذا حصري؟", en: "Why Haseri?" },
  "home_feature1_title": { ar: "أسعار المصنع", en: "Factory Prices" },
  "home_feature1_desc": { ar: "وفر حتى 40% على احتياجاتك الغذائية", en: "Save up to 40% on your groceries" },
  "home_feature2_title": { ar: "توصيل سريع", en: "Fast Delivery" },
  "home_feature2_desc": { ar: "توصيل خلال 48 ساعة في دمشق", en: "Delivery within 48 hours in Damascus" },
  "home_feature3_title": { ar: "موردين حصريين", en: "Exclusive Suppliers" },
  "home_feature3_desc": { ar: "منتجات مختارة من أفضل المصانع", en: "Curated products from the best factories" },
  "home_how_title": { ar: "كيف يعمل؟", en: "How It Works" },
  "home_step1": { ar: "اشترك شهرياً", en: "Subscribe Monthly" },
  "home_step1_desc": { ar: "ادفع 5$ شهرياً للاشتراك", en: "Pay $5/month to subscribe" },
  "home_step2": { ar: "تصفح واختر", en: "Browse & Choose" },
  "home_step2_desc": { ar: "اختر من تشكيلة واسعة من المنتجات", en: "Choose from a wide range of products" },
  "home_step3": { ar: "استلم طلبك", en: "Receive Your Order" },
  "home_step3_desc": { ar: "التوصيل خلال يومين إلى باب منزلك", en: "Delivered to your door within 2 days" },

  // Catalog
  "catalog_title": { ar: "كتالوج المنتجات", en: "Product Catalog" },
  "catalog_all": { ar: "الكل", en: "All" },
  "catalog_add_to_cart": { ar: "أضف للسلة", en: "Add to Cart" },
  "catalog_factory_price": { ar: "سعر المصنع", en: "Factory Price" },
  "catalog_retail_price": { ar: "سعر التجزئة", en: "Retail Price" },
  "catalog_save": { ar: "وفّر", en: "Save" },
  "catalog_category_unavailable": { ar: "هذه الفئة غير متوفرة حالياً", en: "This category is currently unavailable" },
  "catalog_no_products": { ar: "لا توجد منتجات", en: "No products" },
  "catalog_renew_prompt": { ar: "اشتراكك منتهي. جدد الاشتراك لإضافة منتجات للسلة.", en: "Your subscription has expired. Renew to add products to cart." },
  "catalog_renew_button": { ar: "جدد الاشتراك", en: "Renew Subscription" },

  // Sign Up
  "signup_title": { ar: "تسجيل الاشتراك", en: "Sign Up" },
  "signup_name": { ar: "الاسم", en: "Name" },
  "signup_name_placeholder": { ar: "أدخل اسمك", en: "Enter your name" },
  "signup_phone": { ar: "رقم الهاتف", en: "Phone Number" },
  "signup_phone_placeholder": { ar: "أدخل رقم هاتفك", en: "Enter your phone number" },
  "signup_city": { ar: "المدينة", en: "City" },
  "signup_select_city": { ar: "اختر المدينة", en: "Select a city" },
  "signup_submit": { ar: "تسجيل", en: "Sign Up" },
  "signup_phone_duplicate": { ar: "هذا الرقم مستخدم بالفعل", en: "This number is already in use" },
  "signup_name_required": { ar: "الرجاء إدخال الاسم", en: "Please enter your name" },
  "signup_phone_required": { ar: "الرجاء إدخال رقم الهاتف", en: "Please enter your phone number" },
  "signup_city_required": { ar: "الرجاء اختيار المدينة", en: "Please select a city" },

  // Subscribe
  "subscribe_title": { ar: "اشترك في حصري", en: "Subscribe to Haseri" },
  "subscribe_plan": { ar: "الخطة الشهرية", en: "Monthly Plan" },
  "subscribe_fee": { ar: "5$ شهرياً", en: "$5/month" },
  "subscribe_benefit1": { ar: "أسعار المصنع على جميع المنتجات", en: "Factory prices on all products" },
  "subscribe_benefit2": { ar: "توصيل سريع خلال 48 ساعة", en: "Fast delivery within 48 hours" },
  "subscribe_benefit3": { ar: "إلغاء في أي وقت", en: "Cancel anytime" },
  "subscribe_confirm": { ar: "تأكيد والدفع", en: "Confirm & Pay" },

  // Sham Cash
  "shamcash_title": { ar: "الدفع عبر Sham Cash", en: "Payment via Sham Cash" },
  "shamcash_amount": { ar: "المبلغ", en: "Amount" },
  "shamcash_pay": { ar: "ادفع", en: "Pay" },
  "shamcash_cancel": { ar: "إلغاء", en: "Cancel" },
  "shamcash_success": { ar: "تم الدفع بنجاح! اشتراكك مفعّل الآن.", en: "Payment successful! Your subscription is now active." },
  "shamcash_failed": { ar: "تم إلغاء الدفع.", en: "Payment cancelled." },

  // Cart
  "cart_title": { ar: "سلة التسوق", en: "Shopping Cart" },
  "cart_empty": { ar: "سلتك فارغة", en: "Your cart is empty" },
  "cart_browse": { ar: "تصفح المنتجات", en: "Browse Products" },
  "cart_product": { ar: "المنتج", en: "Product" },
  "cart_price": { ar: "السعر", en: "Price" },
  "cart_qty": { ar: "الكمية", en: "Qty" },
  "cart_subtotal": { ar: "المجموع الفرعي", en: "Subtotal" },
  "cart_address": { ar: "عنوان التوصيل", en: "Delivery Address" },
  "cart_address_placeholder": { ar: "أدخل عنوانك بالتفصيل", en: "Enter your full address" },
  "cart_checkout": { ar: "إتمام الطلب", en: "Checkout" },
  "cart_delivery_unavailable": { ar: "التوصيل غير متاح في مدينتك بعد", en: "Delivery is not yet available in your city" },
  "cart_total": { ar: "الإجمالي", en: "Total" },
  "cart_remove": { ar: "حذف", en: "Remove" },
  "cart_delivery_estimate": { ar: "تاريخ التوصيل المتوقع", en: "Estimated Delivery Date" },
  "cart_order_confirmed": { ar: "تم تأكيد طلبك!", en: "Your order is confirmed!" },
  "cart_order_number": { ar: "رقم الطلب", en: "Order Number" },
  "cart_remove_confirm": { ar: "هل تريد حذف هذا المنتج من السلة؟", en: "Remove this item from cart?" },

  // Orders
  "orders_title": { ar: "طلباتي", en: "My Orders" },
  "orders_status_confirmed": { ar: "مؤكد", en: "Confirmed" },
  "orders_status_dispatched": { ar: "تم الإرسال", en: "Dispatched" },
  "orders_status_delivered": { ar: "تم التوصيل", en: "Delivered" },
  "orders_estimated_delivery": { ar: "تاريخ التوصيل المتوقع", en: "Estimated Delivery" },
  "orders_no_orders": { ar: "لا توجد طلبات بعد", en: "You have no orders yet" },
  "orders_view_history": { ar: "عرض سجل الطلبات", en: "View Order History" },
  "orders_date": { ar: "التاريخ", en: "Date" },
  "order_items": { ar: "المنتجات", en: "Items" },
  "order_total": { ar: "الإجمالي", en: "Total" },

  // Order History
  "history_title": { ar: "سجل الطلبات", en: "Order History" },
  "history_empty": { ar: "لا توجد طلبات سابقة", en: "You have no orders yet" },
  "history_browse": { ar: "تصفح الكتالوج", en: "Browse Catalog" },

  // Account
  "account_title": { ar: "حسابي", en: "My Account" },
  "account_name": { ar: "الاسم", en: "Name" },
  "account_phone": { ar: "الهاتف", en: "Phone" },
  "account_city": { ar: "المدينة", en: "City" },
  "account_subscription": { ar: "حالة الاشتراك", en: "Subscription Status" },
  "account_status_active": { ar: "نشط", en: "Active" },
  "account_status_expired": { ar: "منتهي", en: "Expired" },
  "account_status_cancelled": { ar: "ملغي", en: "Cancelled" },
  "account_cancel_sub": { ar: "إلغاء الاشتراك", en: "Cancel Subscription" },
  "account_cancel_confirm": { ar: "هل أنت متأكد من إلغاء الاشتراك؟", en: "Are you sure you want to cancel?" },
  "account_cancelled_msg": { ar: "تم إلغاء اشتراكك. ينتهي في نهاية الفترة الحالية.", en: "Your subscription has been cancelled. It ends at the end of the current period." },
  "account_renew": { ar: "جدد الاشتراك", en: "Renew Subscription" },

  // Admin
  "admin_title": { ar: "لوحة الإدارة", en: "Admin Dashboard" },
  "admin_active_subs": { ar: "المشتركين النشطين", en: "Active Subscribers" },
  "admin_new_subs": { ar: "مشتركين جدد", en: "New Subscribers" },
  "admin_orders": { ar: "الطلبات", en: "Orders" },
  "admin_revenue": { ar: "الإيرادات (7 أيام)", en: "Revenue (7 days)" },
  "admin_show_data": { ar: "عرض البيانات", en: "Show Data" },
  "admin_show_empty": { ar: "عرض حالة فارغة", en: "Show Empty State" },
  "admin_recent_orders": { ar: "أحدث الطلبات", en: "Recent Orders" },

  // Fulfilment
  "fulfilment_title": { ar: "تجهيز الطلبات", en: "Fulfilment" },
  "fulfilment_select_date": { ar: "اختر تاريخ التوصيل", en: "Select Delivery Date" },
  "fulfilment_grouped": { ar: "الطلبات حسب المنتج (دمشق)", en: "Orders by Product (Damascus)" },
  "fulfilment_product": { ar: "المنتج", en: "Product" },
  "fulfilment_total_qty": { ar: "إجمالي الكمية", en: "Total Quantity" },
  "fulfilment_no_orders": { ar: "لا توجد طلبات مدفوعة لهذا التاريخ", en: "No paid orders for this date" },

  // Dispatch
  "dispatch_title": { ar: "توزيع الطلبات", en: "Dispatch Orders" },
  "dispatch_mark_dispatched": { ar: "تحديد كمرسل", en: "Mark Dispatched" },
  "dispatch_mark_delivered": { ar: "تحديد كموصّل", en: "Mark Delivered" },
  "dispatch_late": { ar: "متأخر", en: "Late" },
  "dispatch_dispatched_at": { ar: "أرسل في", en: "Dispatched at" },
  "dispatch_delivered_at": { ar: "وصل في", en: "Delivered at" },
  "dispatch_no_orders": { ar: "لا توجد طلبات", en: "No orders" },
  "dispatch_notification": { ar: "إشعار: تم إرسال طلبك ", en: "Notification: Your order " },

  // Products Management
  "products_title": { ar: "إدارة المنتجات والموردين", en: "Product & Tier Management" },
  "products_add": { ar: "إضافة منتج", en: "Add Product" },
  "products_edit": { ar: "تعديل", en: "Edit" },
  "products_hide": { ar: "إخفاء", en: "Hide" },
  "products_show": { ar: "إظهار", en: "Show" },
  "products_name": { ar: "الاسم", en: "Name" },
  "products_category": { ar: "الفئة", en: "Category" },
  "products_supplier": { ar: "المورد", en: "Supplier" },
  "products_price": { ar: "السعر", en: "Price" },
  "products_tier": { ar: "مستوى المورد", en: "Supplier Tier" },
  "products_tier_exclusive": { ar: "حصري", en: "Exclusive" },
  "products_tier_standard": { ar: "عادي", en: "Standard" },
  "products_preview": { ar: "معاينة الكتالوج", en: "Catalog Preview" },
  "products_hidden": { ar: "مخفي", en: "Hidden" },
  "products_save": { ar: "حفظ", en: "Save" },
  "products_cancel": { ar: "إلغاء", en: "Cancel" },

  // Common
  "lang_toggle": { ar: "English", en: "العربية" },
  "back_home": { ar: "العودة للرئيسية", en: "Back to Home" },
  "yes": { ar: "نعم", en: "Yes" },
  "no": { ar: "لا", en: "No" },
  "loading": { ar: "جار التحميل...", en: "Loading..." },
  "brand_name": { ar: "حصري", en: "Haseri" },
  "tagline": { ar: "أسعار حصرية لكل عائلة", en: "Exclusive prices for every family" },
};

function getLang() {
  return localStorage.getItem("haseri_lang") || "ar";
}

function setLang(lang) {
  localStorage.setItem("haseri_lang", lang);
  applyLang(lang);
}

function applyLang(lang) {
  const isRTL = lang === "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", isRTL);
  document.body.classList.toggle("ltr", !isRTL);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key] && translations[key][lang]) {
      el.textContent = translations[key][lang];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[key] && translations[key][lang]) {
      el.placeholder = translations[key][lang];
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (translations[key] && translations[key][lang]) {
      el.title = translations[key][lang];
    }
  });

  // Update page title
  const titleEl = document.querySelector("title");
  if (titleEl && titleEl.getAttribute("data-page-key")) {
    const key = titleEl.getAttribute("data-page-key");
    if (translations[key] && translations[key][lang]) {
      const brand = translations["brand_name"][lang];
      titleEl.textContent = `${translations[key][lang]} | ${brand}`;
    }
  }

  // Re-render dynamic content
  if (typeof window.renderPage === "function") {
    window.renderPage();
  }
}

function t(key) {
  const lang = getLang();
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return key;
}

function toggleLang() {
  const current = getLang();
  setLang(current === "ar" ? "en" : "ar");
}

// Initialize on load
if (typeof window !== "undefined") {
  window.getLang = getLang;
  window.setLang = setLang;
  window.applyLang = applyLang;
  window.t = t;
  window.toggleLang = toggleLang;
}
