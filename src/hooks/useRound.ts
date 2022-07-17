import { BigNumber } from 'ethers';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { client } from '../supabase';
import type { Round } from './useRounds';

export function useRound(id: string) {
  const [round, setRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setLoading(true);
          const { data, error } = await client.from('rounds').select().eq('id', Number.parseInt(id));

          if (error) {
            console.error(error);
            setLoading(false);
            return;
          }

          setRound(
            data.length > 0
              ? {
                  ...data[0],
                  proposal_start: moment(data[0].proposal_start),
                  proposal_end: moment(data[0].proposal_end),
                  voting_start: moment(data[0].voting_start),
                  voting_end: moment(data[0].voting_end),
                  allocation_token_amount: BigNumber.from(data[0].allocation_token_amount),
                }
              : null
          );
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  return { round, loading };
}
