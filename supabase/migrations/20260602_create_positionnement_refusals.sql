-- Refus de positionnements visibles par la diaspora (sync cross-appareils).
-- L’étudiant enregistre un refus ici car PUT /positionnements lui est interdit.

create table if not exists public.positionnement_refusals (
  positionnement_id bigint primary key,
  annonce_id        bigint not null,
  diaspora_backend_id bigint not null,
  created_at        timestamptz not null default now()
);

create index if not exists positionnement_refusals_diaspora_idx
  on public.positionnement_refusals (diaspora_backend_id);

alter table public.positionnement_refusals enable row level security;

create policy "Authenticated can insert positionnement refusals"
  on public.positionnement_refusals for insert
  to authenticated
  with check (true);

create policy "Authenticated can read positionnement refusals"
  on public.positionnement_refusals for select
  to authenticated
  using (true);
