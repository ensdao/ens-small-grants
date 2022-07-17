import moment from 'moment';
import { useState, useEffect } from 'react';

import { client } from '../supabase';
import type { SnapshotVote } from './useSnapshotProposal';

export type Grant = {
  id: number;
  proposer: string;
  round_id: number;
  title: string;
  description: string;
  full_text: string;
  created_at: moment.Moment;
  updated_at: moment.Moment;
  vote_count?: number | null;
  vote_status?: boolean | null;
  vote_samples?: SnapshotVote[];
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

        setGrants(
          data.map(p => ({
            ...p,
            created_at: moment(p.created_at),
            updated_at: moment(p.updated_at),
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [roundId]);

  return { grants, loading };
}
