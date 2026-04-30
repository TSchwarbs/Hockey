-- ============================================================
-- Drop Off Windows
-- ============================================================
create table if not exists drop_off_windows (
  id            uuid primary key default gen_random_uuid(),
  date          date not null unique,
  open_time     time not null,
  close_time    time not null,
  max_bookings  integer,
  is_blocked    boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table drop_off_windows enable row level security;

-- Public: read open (non-blocked) windows
create policy "Public read drop_off_windows"
  on drop_off_windows for select
  to anon, authenticated
  using (true);

-- Admin: full write access
create policy "Admin insert drop_off_windows"
  on drop_off_windows for insert
  to authenticated
  with check (true);

create policy "Admin update drop_off_windows"
  on drop_off_windows for update
  to authenticated
  using (true);

create policy "Admin delete drop_off_windows"
  on drop_off_windows for delete
  to authenticated
  using (true);


-- ============================================================
-- Bookings
-- ============================================================
create table if not exists bookings (
  id                 uuid primary key default gen_random_uuid(),
  window_id          uuid not null references drop_off_windows(id),
  customer_name      text not null,
  customer_email     text not null,
  customer_phone     text not null,
  hollow_depth       text not null check (hollow_depth in ('3/8"', '1/2"', '5/8"')),
  notes              text,
  status             text not null default 'confirmed'
                       check (status in ('confirmed', 'cancelled', 'completed')),
  cancellation_token uuid not null unique default gen_random_uuid(),
  token_expires_at   timestamptz not null,
  reminder_sent      boolean not null default false,
  created_at         timestamptz not null default now()
);

alter table bookings enable row level security;

-- Anonymous customers can create bookings
create policy "Anon insert bookings"
  on bookings for insert
  to anon
  with check (true);

-- No public read (customer data is private)
-- Admins get full access
create policy "Admin all bookings"
  on bookings for all
  to authenticated
  using (true)
  with check (true);


-- ============================================================
-- Indexes
-- ============================================================
create index if not exists bookings_window_id_idx      on bookings (window_id);
create index if not exists bookings_status_idx         on bookings (status);
create index if not exists bookings_cancellation_token on bookings (cancellation_token);
create index if not exists bookings_reminder_sent_idx  on bookings (reminder_sent) where reminder_sent = false;
create index if not exists drop_off_windows_date_idx   on drop_off_windows (date);


-- ============================================================
-- Seed: example windows (remove before production)
-- ============================================================
-- insert into drop_off_windows (date, open_time, close_time, max_bookings)
-- values
--   (current_date + 1, '16:00', '20:00', null),
--   (current_date + 2, '16:00', '20:00', null),
--   (current_date + 4, '10:00', '14:00', 20);
