create table grants (
  id integer primary key generated always as identity,
  round_id integer references rounds(id) not null,
  proposer varchar not null,
  title text not null,
  description text not null,
  full_text text not null,
  deleted boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row-Level Security
alter table grants
  enable row level security;

-- Anyone can read
create policy "Grants are viewable by everyone."
  on grants for select using (true);

-- Only authenticated can write, which is just edge function
create policy "Grants are updatable by auth"
  ON grants for insert to authenticated with check (true);
