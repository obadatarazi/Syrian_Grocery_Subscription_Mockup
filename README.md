# حصري — نموذج اشتراك التموين

نموذج تجريبي ثابت (HTML / CSS / JS) لاشتراك تموين بأسعار المصنع في سوريا.
واجهة عربية فقط (RTL). لا خلفية ولا قاعدة بيانات ولا خطوة بناء.

## How to Open

1. Open this folder.
2. Double-click `index.html` to open it in your browser.
3. Click through the pages — every screen is a standalone HTML file using shared CSS/JS.

> Tip: if your browser blocks scripts on `file://`, run `python3 -m http.server` in this folder and open the URL it prints.

## Folder Structure

```
.
├── index.html          # Home (US-01)
├── catalog.html        # Catalog (US-02)
├── signup.html         # Sign-up (US-03)
├── subscribe.html      # Subscribe + Sham Cash mock (US-04, US-05)
├── cart.html           # Cart & checkout (US-06)
├── orders.html         # Orders with status (US-07)
├── order-history.html  # Order history (US-08)
├── account.html        # Account & subscription (US-09)
├── admin.html          # Admin dashboard (US-10)
├── fulfilment.html     # Fulfilment by product (US-11)
├── dispatch.html       # Dispatch / deliver (US-12)
├── products.html       # Product & tier management (US-13, US-14)
├── css/style.css
├── js/
│   ├── data.js         # Demo data + SUBSCRIPTION_FEE (500 SYP)
│   ├── i18n.js         # Arabic UI strings (RTL)
│   ├── common.js       # Header, footer, cart, toast
│   └── pages/          # One script per page
├── assets/             # Placeholder icons (no external images)
└── README.md
```

## Screen List & User Story Mapping

| Page | File | User Story |
|------|------|------------|
| Home | index.html | US-01 |
| Catalog | catalog.html | US-02 |
| Sign Up | signup.html | US-03 |
| Subscribe | subscribe.html | US-04 |
| Sham Cash Payment (modal) | subscribe.html | US-05 |
| Cart & Checkout | cart.html | US-06 |
| Orders | orders.html | US-07 |
| Order History | order-history.html | US-08 |
| Account | account.html | US-09 |
| Admin Dashboard | admin.html | US-10 |
| Fulfilment | fulfilment.html | US-11 |
| Dispatch | dispatch.html | US-12 |
| Product Management | products.html | US-13 |
| Tier Management & Preview | products.html | US-14 |

## Demo Toggles & Special Inputs

### Language
- Arabic (RTL) only — no English version.

### رقم مكرر عند التسجيل
- أدخل الهاتف **`0000`** لرؤية: «هذا الرقم مستخدم بالفعل».

### دفع Sham Cash (وهمي)
- اشترك → **تأكيد والدفع** يفتح نافذة Sham Cash.
- **ادفع** = نجاح + تفعيل الاشتراك.
- **إلغاء** = فشل. لا دفع حقيقي.

### Cart Delivery Restriction
- City other than Damascus → “Delivery is not yet available in your city” and checkout disabled.
- Cart is pre-seeded with sample items so checkout is demoable on open.

### Expired Subscription
- Account → demo buttons **Active / Expired / Cancelled**.
- With **Expired**, adding to cart (or visiting catalog) shows the renewal prompt.

### Cancel Subscription
- Account → **Cancel Subscription** → confirmation → status message: “Ends at end of current period.”

### Admin Dashboard Empty State
- Toggle on the admin page switches between demo numbers and all zeros.

### Order History Empty State
- Toggle on order history switches between sample orders and “You have no orders yet” + catalog link.

### Empty Catalog Category
- Catalog → **Frozen Goods / المجمدات** → “This category is currently unavailable.”

### Product Without Retail Price
- **سميد الناصر / Al-Nasser Semolina** shows factory price only (no savings).

### Syrian brands in the catalog
- حسين الناصر، سيدي هشام، المراعي، الدرة، هنا، الراعي، الغوطة، أبيدو، السمير/الحسني — plus a competing baladi ghee pack for the exclusive-tier demo.

### Tier Preview
- Products page → change supplier tier. Exclusive hides other brands in that category. **المراعي** is exclusive for ghee/dairy fats; switching it to standard reveals **سمن بلدي** again.

### Dispatch Late Flag
- ORD-003 was delivered after its estimated date and shows a **Late** badge.

### Fulfilment Unpaid Orders
- ORD-004 is unpaid and does not appear when grouping Damascus orders by product.

## Subscription Fee

In `js/data.js`:

```js
const SUBSCRIPTION_FEE = 500; // 500 SYP / month
```

All prices display in SYP (ل.س). Change that constant to update the fee across the mock-up.

## Notes

- All demo state lives in JavaScript memory. Reloading a page resets cart, language, and edits.
- Sample customers: active, expired, cancelled.
- Sample orders for the demo user: confirmed, dispatched, and delivered (one each).
