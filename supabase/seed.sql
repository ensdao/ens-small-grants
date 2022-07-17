insert into rounds (creator, title, snapshot_space_id, allocation_token_address,
  allocation_token_amount, max_winner_count, proposal_start, proposal_end, voting_start, voting_end)
  values ('0x9B6568d72A6f6269049Fac3998d1fadf1E6263cc', 'Test Round 1', 'test.small-grants.eth',
  '0x0000000000000000000', '10000000000000000000', 4, now() - interval '1' day,
  now() + interval '2' day, now() + interval '2' day, now() + interval '5' day);