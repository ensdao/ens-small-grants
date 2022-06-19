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
