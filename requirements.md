You are a senior front-end developer. Build a clickable, static mock-up website for an affordable grocery subscription service in Syria, called "حصري". The purpose is to show the user flow and screens to stakeholders. There is no backend, no database, and no live integrations. Everything is simulated in the browser.

Use the name "حصري" as the site brand in the header and page titles. Arabic only (no English UI).

## Tech requirements
- Primary prototypes: React + Vite + Tailwind in `website/` (storefront) and `admin/` (admin). No real server backend, database, or live API integrations — mock/in-memory services only.
- The original plain HTML/CSS/JS mock remains in `legacy/` for reference; new work targets the React apps.
- Store demo state in memory (React state / in-memory mocks). Reloading the page resets it. Do not use localStorage unless I ask for it.
- Responsive, mobile-first layout.
- Arabic (RTL) only. No English toggle or English UI text.
- Use placeholder images or simple icons where needed. Prefer bundled/local assets over remote font/image CDNs for the demo.
- The subscription fee is 500 SYP/month, shown as a single constant (`SUBSCRIPTION_FEE`) in demo data so it is easy to change. All prices are in SYP (ل.س), not USD.
- Payment: a Sham Cash mock screen with "Pay" and "Cancel" buttons. Pressing Pay simulates success. Pressing Cancel simulates failure. No real payment is processed.
- Notifications: show a mock toast message in place of WhatsApp/SMS.

## Pages and screens to build

**Visitor**
1. Home page with a link to the catalog and a sign-up button.
2. Catalog page with categories: rice, cooking oil, sugar, ghee, vegetables, canned goods. Each product card shows name, size, and factory price. Show the retail price, saving amount, and saving percentage when a retail price is set. If a retail price is missing, show only the factory price. Include a category with no products that displays "This category is currently unavailable."
3. Sign-up page with name, phone number, and city. On submit, show the subscribe page. If the phone number is "0000", show "This number is already in use" as a demo of the duplicate case.

**Customer**
4. Subscribe page showing the 500 SYP/month plan with a confirm button, leading to the Sham Cash mock screen.
5. Cart and checkout page. Add any number of products to one cart. Address field with city selection. If the city is not Damascus, show "Delivery is not yet available in your city" and disable the checkout button. On checkout, show an estimated delivery date within 2 days.
6. Orders page showing status (confirmed, dispatched, delivered) and estimated delivery date. Include sample orders in each state.
7. Order history page with past orders, newest first. If empty, show "You have no orders yet" with a link to the catalog.
8. Account page with subscription status and a cancel subscription button. Cancelling shows a confirmation and sets the status to "Ends at end of current period." Include an expired-subscription state where adding to cart shows a renewal prompt.

**Admin**
9. Admin dashboard with a summary panel: active subscribers, new subscribers, orders, and revenue for the past 7 days. Show zeros when there is no activity, using a demo toggle to switch between data and empty state.
10. Fulfilment page: pick a delivery date and see Damascus orders grouped by product, with total quantity per product. Unpaid orders are not shown.
11. Dispatch page: buttons to mark an order dispatched (records a time) and delivered. Marking dispatched shows the mock notification toast. If an order is delivered after its estimated date, show a "late" flag.
12. Product and tier management page: list products with add, edit, and hide controls. Each supplier has a tier per category (exclusive or standard). Show a preview of the customer catalog reflecting the tier choice: exclusive hides other brands in that category, standard shows all brands.

## Demo data (hard-coded in JavaScript)
- Cities: Damascus (available), plus two others marked "not yet available."
- Categories: rice, cooking oil, sugar, ghee, vegetables, canned goods.
- Suppliers: 3 factories. One exclusive ghee supplier, two standard suppliers for rice and oil.
- Products: at least 2 per category. Leave one product without a retail price to show the edge case.
- Sample customers: one active, one expired, one cancelled.
- Sample orders: one each in confirmed, dispatched, and delivered states.

## Deliverables
1. Repo layout with `website/` (storefront), `admin/` (admin), and `legacy/` (original HTML mock).
2. Screens covering the visitor, customer, and admin flows listed above (React apps; HTML equivalents remain under `legacy/`).
3. Demo data including the 500 SYP subscription constant (`SUBSCRIPTION_FEE`).
4. A root README explaining how to run `website/` and `admin/` (`npm install` && `npm run dev` in each folder) and pointing to `legacy/` for the old HTML mock.
5. A screen list mapping each page to its user story ID (US-01 to US-14).

Do not add tests or a real backend. Static mock prototypes only — Vite is used for local dev/build of the React apps, not as a production API.
