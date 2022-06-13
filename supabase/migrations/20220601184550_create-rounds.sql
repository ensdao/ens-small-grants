create table rounds (
  id integer primary key generated always as identity,
  creator varchar not null,
  title text not null,
  description text,
  proposal_start timestamp not null,
  proposal_end timestamp not null,
  voting_start timestamp not null,
  voting_end timestamp not null,
  allocation_token_amount varchar not null,
  allocation_token_address varchar not null,
  max_winner_count integer not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
