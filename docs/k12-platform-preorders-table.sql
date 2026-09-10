-- Blue Sands K12 platform pre-order submissions.
-- Run this in Supabase (SQL editor, or via the Supabase MCP) before using the
-- /k12-preorder form. The app has no repo migrations; this file is a record of
-- the schema the code at app/api/k12-ar-pedia/platform-preorder/route.js and
-- app/admin/k12-preorders/* expect.

create table if not exists public.k12_platform_preorders (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),

  -- 1. Customer information
  school_org_name         text not null,
  contact_person          text not null,
  job_title               text not null,
  email                   text not null,
  phone                   text not null,
  location                text not null,

  -- 2. School details
  school_type             text,              -- nursery_primary | secondary | k12 | international | other
  student_count           integer,
  teacher_count           integer,
  current_lms             text,

  -- 3. Pre-order package
  package                 text,              -- one PREORDER_PACKAGES id (a /products/<slug>)
  student_licenses        integer,
  teacher_admin_accounts  integer,           -- retired from the form 2026-09-10; column kept, no longer written
  subscription_durations  text[] not null default '{}',  -- termly | annual | multi_year

  -- 4. (retired 2026-09-10) the "what are you interested in" multi-select was
  -- removed from the form; column kept for old rows, no longer written.
  interests               text[] not null default '{}',

  -- 5. Preferred launch
  implementation_date     date,
  academic_year           text,              -- current | next
  demo_requested          boolean not null default false,

  -- 6. Additional requirements
  additional_requirements text,

  -- 7. Confirmation
  agreed_preorder         boolean not null default false,

  -- Admin workflow
  status                  text not null default 'new',    -- new | contacted | qualified | closed | declined
  admin_notes             text,
  reviewed_by             text,
  reviewed_at             timestamptz
);

create index if not exists k12_platform_preorders_created_at_idx
  on public.k12_platform_preorders (created_at desc);
create index if not exists k12_platform_preorders_status_idx
  on public.k12_platform_preorders (status);

-- Writes and reads go through the service-role key (supabaseAdmin), which
-- bypasses RLS. Enable RLS with no public policies so the anon key cannot read
-- submissions.
alter table public.k12_platform_preorders enable row level security;
