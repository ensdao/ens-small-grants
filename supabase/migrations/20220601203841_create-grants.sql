create table grants (
  id integer primary key generated always as identity,
  round_id integer references rounds(id) not null,
  title text not null,
  description text not null,
  full_text text not null
);
