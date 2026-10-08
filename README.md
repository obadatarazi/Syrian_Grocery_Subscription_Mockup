# حصري — Syrian Grocery Subscription

Static clickable mock-ups for **حصري**, an affordable grocery subscription service in Syria (factory prices). Arabic UI only (RTL). No backend, database, or live payment integrations — demo state lives in memory and resets on reload.

## Project structure

```
.
├── website/          # React + Vite + Tailwind storefront (customer flows)
├── admin/            # React + Vite + Tailwind admin dashboard
├── legacy/           # Original plain HTML/CSS/JS mock (pre-migration)
├── requirements.md   # Stakeholder requirements & user stories
└── README.md
```

| Folder | Role |
|--------|------|
| `website/` | Customer-facing storefront, adapted from the Aroma Care Website prototype for حصري |
| `admin/` | Admin console, adapted from the Aroma Care Admin prototype for حصري (adaptation in progress) |
| `legacy/` | Earlier plain HTML/CSS/JS mock — open HTML files directly; see notes below |

## Brand & locale

- Brand name: **حصري**
- Language: Arabic only (RTL)
- Currency: SYP (ل.س)
- Subscription fee: **500 SYP/month** (`SUBSCRIPTION_FEE` in demo data)
- Payment: Sham Cash mock (Pay = success, Cancel = failure) — no real charges

## How to run

Requires Node.js and npm. Run each app in its own terminal.

### Storefront (`website/`)

```bash
cd website
npm install
npm run dev
```

Dev server defaults to [http://localhost:5173](http://localhost:5173).

### Admin (`admin/`)

```bash
cd admin
npm install
npm run dev
```

Dev server defaults to [http://localhost:5174](http://localhost:5174).

Optional production-style build:

```bash
npm run build
npm run preview
```

## Static mock — what that means

- No real API, auth server, or database
- Flows and screens are for stakeholder demos
- In-memory / mock services; reloading clears demo edits
- Sham Cash and toasts replace real payments and WhatsApp/SMS

Product requirements and user stories (US-01–US-14) live in [`requirements.md`](./requirements.md). The tech stack there now allows React + Vite + Tailwind prototypes in `website/` and `admin/` (the original “plain HTML only” constraint no longer applies to the primary mock).

## Legacy HTML mock

The first mock (standalone HTML pages, shared CSS/JS) is under [`legacy/`](./legacy/).

```bash
cd legacy
# open index.html in a browser, or:
python3 -m http.server
```

Use `legacy/` only if you need the original HTML click-through. New work targets `website/` and `admin/`.

## Screen / user story map (product scope)

| Area | User stories |
|------|----------------|
| Home, catalog, sign-up | US-01–US-03 |
| Subscribe + Sham Cash | US-04–US-05 |
| Cart, orders, history, account | US-06–US-09 |
| Admin dashboard, fulfilment, dispatch, products/tiers | US-10–US-14 |

Exact page mapping and demo toggles for the HTML version are documented historically in `legacy/` page files and the previous root README content; React apps implement the same product scope over time.

## Notes

- Keep secrets out of the repo — use `.env` locally (gitignored); never commit credentials
- `node_modules/` and `dist/` are ignored for both apps
- Stakeholder source of truth for flows: [`requirements.md`](./requirements.md)
