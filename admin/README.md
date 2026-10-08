# حصري — لوحة الإدارة (Haseri Admin)

React admin mock for the Syrian grocery subscription service **حصري**. Demo data is in-memory (no real API). Arabic RTL by default; currency is SYP (ل.س) integers.

## Quick start

```bash
cd admin
npm install
npm run dev
```

Dev server defaults to **http://localhost:5174**.

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Vite on port 5174 |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | TypeScript only |
| `npm run lint` | ESLint |

## Admin features (demo)

- **Dashboard** — active/new subscribers, orders & revenue (last 7 days), empty-state toggle
- **Fulfilment** — Damascus paid orders grouped by product for a delivery date
- **Dispatch** — mark dispatched/delivered, toast, late flag
- **Products** — add/edit/hide, exclusive vs standard supplier tiers, catalog preview
- **Categories / Brands·Suppliers / Customers / Orders / Settings** — existing Admin-prototype CRUD shells (nav slimmed to grocery-relevant items)

## Source layout

```text
src/
├── app/                 # Shell, routing, navigation
├── features/            # Feature modules (dashboard, fulfilment, dispatch, grocery-products, …)
├── shared/              # Design system, CRUD, demo helpers
└── main.tsx
```

Copy `.env.example` to `.env` when a backend is connected later.
