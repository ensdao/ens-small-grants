create table rounds (
  id integer primary key generated always as identity,
  creator varchar not null,
  title text not null,
  description text,
  proposal_start timestamptz not null,
  proposal_end timestamptz not null,
  voting_start timestamptz not null,
  voting_end timestamptz not null,
  allocation_token_amount varchar not null,
  allocation_token_address varchar not null,
  max_winner_count integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
