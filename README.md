# حصري (Haseri) — Grocery Subscription Mock-up

A clickable, static mock-up of an affordable grocery subscription service in Syria.
Built with plain HTML, CSS, and JavaScript. No backend, no database, no build step required.

## How to Open

1. Download/clone this folder.
2. Double-click `index.html` to open in your browser.
3. That's it — every page is a standalone HTML file that links to shared CSS and JS.

> Alternatively, run a local server: `npx serve` or `python -m http.server` in this folder, then visit the shown URL.

## Folder Structure

```
.
├── index.html          # Home page (US-01)
├── catalog.html        # Catalog page (US-02)
├── signup.html         # Sign-up page (US-03)
├── subscribe.html      # Subscribe + Sham Cash mock payment (US-04, US-05)
├── cart.html           # Cart & checkout (US-06)
├── orders.html         # Orders with status (US-07)
├── order-history.html  # Order history (US-08)
├── account.html        # Account & subscription management (US-09)
├── admin.html          # Admin dashboard (US-10)
├── fulfilment.html     # Fulfilment: orders grouped by product (US-11)
├── dispatch.html       # Dispatch: mark dispatched/delivered (US-12)
├── products.html       # Product & tier management (US-13, US-14)
├── css/
│   └── style.css       # All styles
├── js/
│   ├── data.js         # All demo data + $5 subscription constant
│   ├── i18n.js         # Arabic/English translations & RTL/LTR switching
│   ├── common.js       # Shared utilities (header, footer, cart, toast)
│   └── pages/          # One JS file per page
│       ├── home.js
│       ├── catalog.js
│       ├── signup.js
│       ├── subscribe.js
│       ├── cart.js
│       ├── orders.js
│       ├── order-history.js
│       ├── account.js
│       ├── admin.js
│       ├── fulfilment.js
│       ├── dispatch.js
│       └── products.js
├── assets/             # (empty — placeholder for future images)
└── README.md           # This file
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

### Language Toggle
- Click the **English / العربية** button in the header to switch between Arabic (RTL) and English (LTR).
- The choice persists in localStorage.

### Sign-Up Duplicate Phone Demo
- On the sign-up page, enter phone number **`0000`** to see the "This number is already in use" error.

### Admin Dashboard Data/Empty Toggle
- On the admin dashboard, click the toggle switch to flip between showing demo data and an empty state (all zeros).

### Sham Cash Mock Payment
- On the subscribe page, clicking "Confirm & Pay" opens a Sham Cash modal.
- **Pay** = simulated success (subscription activates, redirect to catalog).
- **Cancel** = simulated failure (error toast shown).

### Cart Delivery Restriction
- Selecting a city other than Damascus shows "Delivery is not yet available in your city" and disables checkout.

### Expired Subscription
- The demo user's subscription is active by default. To see the expired state, go to Account → Cancel Subscription, then try adding products in the catalog — a renewal prompt will appear.

### Frozen Goods Category
- In the catalog, clicking the "Frozen Goods / المجمدات" category shows "This category is currently unavailable" (intentionally empty).

### Product Without Retail Price
- "Brown Sugar / سكر بني" in the Sugar category has no retail price — only the factory price is shown (no savings badge).

### Tier Management & Catalog Preview
- On the Products page, change a supplier's tier between Standard and Exclusive.
- The catalog preview at the bottom updates: exclusive tiers hide other brands in that category, standard shows all.

## Subscription Fee

The monthly fee is set as a constant at the top of `js/data.js`:
```js
const SUBSCRIPTION_FEE = 5; // $5/month
```
Change this number to update the price everywhere.

## Notes

- All data is in-memory. Reloading the page resets the cart and any changes made.
- Sample orders include one each in confirmed, dispatched, and delivered states.
- Sample customers include one active, one expired, and one cancelled.
