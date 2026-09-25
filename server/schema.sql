-- Networker — listing applications (Postgres)
--
-- Port of supabase/migrations/0001_applications.sql for a self-hosted Postgres,
-- e.g. on an Oracle Cloud Always Free ARM instance.
--
-- THE SECURITY MODEL IS DIFFERENT FROM THE SUPABASE VERSION, and the difference
-- matters. There, the browser talked to the database directly, so row-level
-- security was the only thing standing between a public anon key and every
-- applicant's email address. Here the browser never touches Postgres — it talks to
-- server.js, which holds the credentials and is the only thing that can read or
-- write. So RLS is not required, and the access rules live in the service instead:
-- POST is public, reading applications needs the admin bearer token.
--
-- The CHECK constraints below are still worth having. They are the last line if a
-- bug in the service ever lets something malformed through.

create extension if not exists "pgcrypto";

create table if not exists applications (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  display_name   text not null,
  headline       text not null,
  contact_email  text not null,
  contact_handle text,

  -- The ladder. Each entry: network, customNetwork, tier, provenance,
  -- deliverable, free, feeAmount, feeCurrency, channels.
  -- jsonb rather than a child table because an application is reviewed and
  -- transcribed as a whole; it is not queried by offer until it becomes a listing.
  offers         jsonb not null,

  -- Review state. An application is never public — it becomes a listing only when
  -- a human approves it.
  status         text not null default 'pending',
  review_note    text,

  -- Kept for abuse triage only. Not shown anywhere, not used for anything else.
  source_ip      inet,

  constraint applications_display_name_len check (char_length(display_name) between 1 and 80),
  constraint applications_headline_len     check (char_length(headline) between 1 and 120),
  constraint applications_email_len        check (char_length(contact_email) between 3 and 160),
  constraint applications_email_shape      check (contact_email like '%_@_%.__%'),
  constraint applications_handle_len       check (contact_handle is null or char_length(contact_handle) <= 80),
  constraint applications_status_valid     check (status in ('pending', 'approved', 'rejected')),
  constraint applications_offers_is_array  check (jsonb_typeof(offers) = 'array'),
  constraint applications_offers_count     check (jsonb_array_length(offers) between 1 and 6)
);

create index if not exists applications_created_at_idx on applications (created_at desc);
create index if not exists applications_status_idx     on applications (status);

-- One pending application per email at a time. A second attempt updates nothing
-- and returns 409, which the form renders as "that looks like a duplicate" rather
-- than silently creating twins for the reviewer to untangle.
create unique index if not exists applications_one_pending_per_email
  on applications (lower(contact_email))
  where status = 'pending';
