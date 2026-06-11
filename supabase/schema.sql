-- ============================================================
-- BROCK'S GYM — Supabase schema
-- Run this in the Supabase SQL editor (Database -> SQL Editor)
-- ============================================================

-- ---------- MACHINES ----------
create table if not exists public.machines (
  id uuid primary key default gen_random_uuid(),
  name text not null,                      -- e.g. "Machine 01"
  venue_name text not null,                -- e.g. "Crimp City Bouldering"
  venue_type text not null default 'bouldering_gym',
  address text not null,
  suburb text not null,
  lat double precision not null,
  lng double precision not null,
  status text not null default 'coming_soon'
    check (status in ('live', 'coming_soon', 'offline')),
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- ENQUIRIES (partner / contact form) ----------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  venue_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  venue_type text not null default 'bouldering_gym',
  suburb text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- ---------- STOCK ITEMS (future: live stock per machine) ----------
-- Not used by the UI yet. Schema is in place so live stock tracking
-- can be added later without a migration. One row per product line
-- per machine.
create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid not null references public.machines (id) on delete cascade,
  product_name text not null,              -- e.g. "Scarlet & Violet booster pack"
  set_code text,                           -- e.g. "SV08"
  price_cents integer not null check (price_cents >= 0),
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists stock_items_machine_id_idx
  on public.stock_items (machine_id);

-- ============================================================
-- Row Level Security
-- Model: a single operator. Any authenticated user is an admin.
-- Create your admin account in Supabase (Authentication -> Users
-- -> Add user) and turn OFF public signups
-- (Authentication -> Providers -> Email -> disable signups).
-- ============================================================

alter table public.machines enable row level security;
alter table public.enquiries enable row level security;
alter table public.stock_items enable row level security;

-- Machines: anyone can read non-offline machines (powers the public
-- location finder); admins can read and write everything.
create policy "public can read visible machines"
  on public.machines for select
  to anon
  using (status in ('live', 'coming_soon'));

create policy "admins can read all machines"
  on public.machines for select
  to authenticated
  using (true);

create policy "admins can insert machines"
  on public.machines for insert
  to authenticated
  with check (true);

create policy "admins can update machines"
  on public.machines for update
  to authenticated
  using (true);

create policy "admins can delete machines"
  on public.machines for delete
  to authenticated
  using (true);

-- Enquiries: the public form can insert; only admins can read/manage.
create policy "anyone can submit an enquiry"
  on public.enquiries for insert
  to anon
  with check (true);

create policy "admins can read enquiries"
  on public.enquiries for select
  to authenticated
  using (true);

create policy "admins can update enquiries"
  on public.enquiries for update
  to authenticated
  using (true);

create policy "admins can delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (true);

-- Stock: public read (for the future public stock view), admin write.
create policy "public can read stock"
  on public.stock_items for select
  to anon, authenticated
  using (true);

create policy "admins can write stock"
  on public.stock_items for insert
  to authenticated
  with check (true);

create policy "admins can update stock"
  on public.stock_items for update
  to authenticated
  using (true);

create policy "admins can delete stock"
  on public.stock_items for delete
  to authenticated
  using (true);

-- ============================================================
-- Seed data (sample machines — edit or delete before launch)
-- ============================================================
insert into public.machines (name, venue_name, venue_type, address, suburb, lat, lng, status, notes)
values
  ('Machine 01', 'Crimp City Bouldering', 'bouldering_gym', '12 Mitchell Rd', 'Alexandria', -33.9046, 151.1936, 'coming_soon', 'Front counter, left of reception'),
  ('Machine 02', 'Overhang Climbing Co', 'bouldering_gym', '48 Parramatta Rd', 'Annandale', -33.8830, 151.1700, 'coming_soon', 'Chill zone next to the slab wall');
