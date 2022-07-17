import { BigNumber } from 'ethers';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { client } from '../supabase';

export type Round = {
  id: string;
  creator: string;
  title: string;
  description?: string | null;
  proposal_start: moment.Moment;
  proposal_end: moment.Moment;
  voting_start: moment.Moment;
  voting_end: moment.Moment;
  allocation_token_amount: BigNumber;
  allocation_token_address: string;
  max_winner_count: number;
  snapshot_space_id: string;
  snapshot_proposal_id?: string | null;
  created_at: string;
  updated_at: string;
};

export function useRounds() {
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await client.from('rounds').select();

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        setRounds(
          data.map(r => ({
            ...r,
            proposal_start: moment(r.proposal_start),
            proposal_end: moment(r.proposal_end),
            voting_start: moment(r.voting_start),
            voting_end: moment(r.voting_end),
            allocation_token_amount: BigNumber.from(r.allocation_token_amount),
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { rounds, loading };
}
