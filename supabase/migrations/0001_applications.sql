-- Networker — listing applications
--
-- One table, one job: accept an application to list a network, and let nobody but
-- the owner read it back.
--
-- THE SECURITY POINT, because it is easy to get wrong and expensive to get wrong:
-- these rows hold real people's names, email addresses and a description of who
-- they can reach. The anon role must be able to INSERT and must NOT be able to
-- SELECT. Without that split, the public anon key — which ships in the JS bundle
-- and is readable by anyone — would hand every visitor the full applicant list.
--
-- Read them from the Supabase dashboard (which uses your owner credentials) or via
-- the service_role key from a server. Never from the browser.

create extension if not exists "pgcrypto";

create table if not exists public.applications (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  display_name   text not null,
  headline       text not null,
  contact_email  text not null,
  contact_handle text,

  -- The ladder. Each entry: network, customNetwork, tier, provenance,
  -- deliverable, free, feeAmount, feeCurrency, channels.
  -- Kept as jsonb rather than a child table because an application is reviewed and
  -- transcribed as a whole; it is not queried by offer until it becomes a listing.
  offers         jsonb not null,

  -- Review state. An application is never public — it becomes a listing only when
  -- a human approves it.
  status         text not null default 'pending',
  review_note    text,

  -- Mirror of the client-side limits in src/lib/validate.js. The browser copy is a
  -- convenience; this is the one that cannot be bypassed. Keep them in step.
  constraint applications_display_name_len check (char_length(display_name) between 1 and 80),
  constraint applications_headline_len     check (char_length(headline) between 1 and 120),
  constraint applications_email_len        check (char_length(contact_email) between 3 and 160),
  constraint applications_email_shape      check (contact_email like '%_@_%.__%'),
  constraint applications_handle_len       check (contact_handle is null or char_length(contact_handle) <= 80),
  constraint applications_status_valid     check (status in ('pending', 'approved', 'rejected')),
  constraint applications_offers_is_array  check (jsonb_typeof(offers) = 'array'),
  constraint applications_offers_count     check (jsonb_array_length(offers) between 1 and 6)
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_status_idx     on public.applications (status);

alter table public.applications enable row level security;

-- Anyone may apply.
--
-- WITH CHECK pins status to 'pending' so a crafted request cannot post itself in
-- pre-approved. There is deliberately no USING clause and no SELECT policy: with
-- RLS on and no SELECT policy, reads by anon and authenticated return nothing at
-- all. That is the intended behaviour, not an oversight.
drop policy if exists "anon can submit an application" on public.applications;
create policy "anon can submit an application"
  on public.applications
  for insert
  to anon, authenticated
  with check (status = 'pending');

-- No update or delete policy either, so an applicant cannot alter or remove a
-- submission after the fact. Review and correction happen with owner credentials.

comment on table public.applications is
  'Listing applications. anon may INSERT only — never grant it SELECT, the rows hold personal data and the anon key is public.';
