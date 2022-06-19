import { useEffect, useState } from 'react';

import { client } from '../supabase';

export type Round = {
  id: string;
  creator: string;
  title: string;
  description?: string | null;
  proposal_start: string;
  proposal_end: string;
  voting_start: string;
  voting_end: string;
  allocation_token_amount: string;
  allocation_token_address: string;
  max_winner_count: number;
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

        setRounds(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { rounds, loading };
}
