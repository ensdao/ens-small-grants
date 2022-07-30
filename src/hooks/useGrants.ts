import moment from 'moment';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { client } from '../supabase';
import { Round } from './useRounds';
import { SnapshotVote } from './useSnapshotProposal';

const QUERY = `
    query GetSnapshotScores($proposalId: String!, $currentUser: String) {
      proposal(id: $proposalId) {
        id
        choices
        scores
        scores_state
      }

      currentVote: votes(first: 1, where: { proposal: $proposalId, voter: $currentUser }) {
        id
        voter
        vp
        choice
      }
    }
`;

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

export function useGrants(round: Round) {
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: account } = useAccount();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await client.from('grants').select().eq('round_id', round.id).eq('deleted', false);

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        const scores = {} as Record<number, number>;

        if (round.snapshot_proposal_id) {
          const res = await fetch('https://hub.snapshot.org/graphql', {
            method: 'POST',
            body: JSON.stringify({
              query: QUERY,
              variables: { proposalId: round.snapshot_proposal_id, currentUser: account?.address },
            }),
            headers: {
              'content-type': 'application/json',
            },
          });

          const body = await res.json();
          const snapshotProposal = body.data.proposal;

          for (const i in snapshotProposal.choices) {
            const id = Number.parseInt(snapshotProposal.choices[i].split('-')[0]);
            scores[id] = snapshotProposal.scores[i];
          }
        }

        setGrants(
          data!
            .map(p => ({
              ...p,
              created_at: moment(p.created_at),
              updated_at: moment(p.updated_at),
              vote_count: scores[p.id],
            }))
            .sort((a, b) => (a.vote_count === b.vote_count ? 0 : a.vote_count < b.vote_count ? 1 : -1))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [round, account]);

  return { grants, loading };
}
