import { useState, useEffect } from 'react';

import { client } from '../supabase';

export type Grant = {
  id: number;
  proposer: string;
  round_id: number;
  title: string;
  description: string;
  full_text: string;
  created_at: string;
  updated_at: string;
  vote_count?: number | null;
  vote_status?: boolean | null;
};

export function useGrants(roundId: number) {
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await client.from('grants').select().eq('round_id', roundId).eq('deleted', false);

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        setGrants(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [roundId]);

  return { grants, loading };
}
