# BROCK'S GYM — TCG vending machine site

Next.js 14 (App Router) + Supabase. Marketing site, machine location finder, partner enquiries, and an operator dashboard — with the database schema already in place for live per-machine stock tracking later.

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page — pitch, how it works, partner pitch, FAQ |
| `/locations` | Location finder — OpenStreetMap map + machine cards (public, reads `machines`) |
| `/partner` | Host-a-machine pitch + enquiry form (writes to `enquiries`) |
| `/login` | Operator login (Supabase Auth) |
| `/admin` | Dashboard — triage enquiries, add/edit/delete machines, stock tab placeholder |

## Setup (15 minutes)

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, run it. This creates `machines`, `enquiries` and `stock_items` with row-level security and two sample machines.
3. Create your admin account: **Authentication → Users → Add user** (use "Auto confirm user").
4. Lock the door: **Authentication → Sign In / Up → Email** and **disable new user signups**. The RLS model treats any authenticated user as an admin, so this step matters.
5. Grab your keys from **Project Settings → API**.

### 2. Local dev

```bash
cp .env.example .env.local   # then paste in your Supabase URL + anon key
npm install
npm run dev
```

Visit `http://localhost:3000`. Log in at `/login` with the account from step 3.

### 3. Deploy (Vercel)

Push to GitHub, import the repo in Vercel, and add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the project settings. No other config needed — the map uses OpenStreetMap tiles, so there's no maps API key to manage.

## Security model

- Only the **anon key** is used anywhere — there is no service-role key in this codebase, so nothing sensitive can leak from the client or the repo.
- Row Level Security does the real work:
  - `machines`: public can read `live`/`coming_soon`; only authenticated users can write.
  - `enquiries`: public can insert (the form); only authenticated users can read or update.
  - `stock_items`: public read, authenticated write.
- `/admin` is additionally gated by `src/middleware.ts`, which redirects logged-out visitors to `/login`.
- The enquiry API route validates and length-caps every field server-side.

## Adding live stock tracking later

The groundwork is done:

1. **Schema** — `stock_items` already exists (`machine_id`, `product_name`, `set_code`, `price_cents`, `quantity`), with public-read/admin-write RLS.
2. **Admin** — build the UI behind the existing "Stock" tab in `src/components/AdminDashboard.tsx` (a per-machine table with quantity steppers is the natural shape).
3. **Public** — add a stock list to `MachineCard` or the map popups by selecting `stock_items` joined on `machine_id`.

No migration, no policy changes — just UI.

## Customising

- **Brand tokens** live in `tailwind.config.ts` and `src/app/globals.css` (basalt / stone / ember palette).
- **Copy** is inline in each page component — `src/app/page.tsx` for the landing page.
- **Contact email + ABN** are placeholders in `src/components/Footer.tsx`. Swap in the real ones before launch.
- **Sample machines** were seeded by `schema.sql` — edit or delete them from the admin Machines tab.

## A note on IP

The site deliberately uses an original rock/gym aesthetic and refers to the product factually ("Pokémon TCG"), with a non-affiliation disclaimer in the footer. Don't add Pokémon character artwork, logos, or card images you don't have rights to — as the resident law student you already know this, but future-you might be moving fast.
