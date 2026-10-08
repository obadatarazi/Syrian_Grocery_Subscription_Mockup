# Admin Prototype — Discounts demo

This folder is a **full clone** of the Admin app for local prototyping. Do not treat it as the production `Admin/` package.

## Discounts / Coupons

- Route: `/admin/discounts`
- Data is **mock only** (in-memory store seeded from `src/features/discounts/mocks/discount-catalog.seed.ts`).
- Changes reset on full page reload.
- Product **SALE** prices and **BOGO** remain separate features — they are not coupon types on this screen.

## Run

From `Admin-prototype`:

```bash
npm install
npm run dev -- --port 5174
```

Or:

```bash
npm run dev:5174
```

Open `http://localhost:5174`. Auth uses mocks when `VITE_USE_MOCKS=true` (see `.env`) — any email/password logs you in as a mock super-admin.
