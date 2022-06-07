create table rounds (
  id integer primary key generated always as identity,
  name text not null,
  description text
);
