insert into rounds (
  creator,
  title,
  snapshot_space_id,
  allocation_token_address,
  allocation_token_amount,
  max_winner_count,
  proposal_start,
  proposal_end,
  voting_start,
  voting_end,
  houseId
  )
  values (
    '0x9B6568d72A6f6269049Fac3998d1fadf1E6263cc',
    'Test Round 1',
    'test.small-grants.eth',
    '0x0000000000000000000',
    '10000000000000000000',
    4,
    now() - interval '1' day,
    now() + interval '2' day,
    now() + interval '2' day,
    now() + interval '5' day,
    1
  );

-- Insert two houses
INSERT INTO houses (slug, title, description, hidden, created_at)
  values(
    'working-groups',
    'Working Groups',
    'Lorem ipsum dolor sit amet consectetur. Non in congue id et urna. Leo turpis ultricies sit proin tincidunt pulvinar facilisis est lacus. Pellentesque auctor sed dolor nullam suspendisse blandit.',
    FALSE,
    now()
  ),
  (
    'fellows',
    'Public Goods Fellows',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras volutpat neque eget ultrices ullamcorper. Sed ut cursus ex. Duis orci tortor, ornare gravida libero a, ullamcorper facilisis turpis.',
    FALSE,
    now()
  );
