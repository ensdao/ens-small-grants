import { useState, useEffect } from 'react';

import { client } from '../supabase';
import type { Grant } from './useGrants';
import { useRound } from './useRound';
import { useSnapshotProposal } from './useSnapshotProposal';

export function useGrant(grantId: string) {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const { round, loading: roundLoading } = useRound(grant?.round_id.toString() || '');
  const { proposal: snapshotProposal, loading: snapshotLoading } = useSnapshotProposal(
    round?.snapshot_proposal_id || ''
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await client.from('grants').select().eq('id', grantId).eq('deleted', false);

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          setGrant(data[0]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [grantId]);

  useEffect(() => {
    setGrant(currentGrant => {
      if (currentGrant && snapshotProposal) {
        // determine choice id for grant
        const choiceId = snapshotProposal.choices.findIndex(choice => {
          const split = choice.split(' - ');

          if (split.length < 2) {
            return false;
          }

          return grantId === split[0];
        });
        // get score for the grant
        const score = snapshotProposal.scores[choiceId];

        const votes = snapshotProposal.votes.filter(v => v.choice === choiceId);

        return {
          ...currentGrant,
          vote_count: score,
          vote_status: snapshotProposal.scores_state === 'final',
          vote_samples: votes,
        };
      } else {
        return currentGrant;
      }
    });
  }, [grantId, snapshotProposal]);

  return {
    grant,
    loading: loading || roundLoading || snapshotLoading,
    votesAvailable: snapshotProposal?.votes_available,
  };
}
