import { useEffect, useState } from 'react';

import { SnapshotVote, useSnapshotProposal } from './useSnapshotProposal';

export type SnapshotGrant = {
  choiceId: number;
  voteCount: number;
  voteStatus: boolean;
  voteSamples: SnapshotVote[];
  votesAvailable?: number | null;
  currentVotes: number;
};

export function useSnapshotGrant(snapshotProposalId: string, grantId: string) {
  const { proposal: snapshotProposal, loading } = useSnapshotProposal(snapshotProposalId);
  const [snapshotGrant, setSnapshotGrant] = useState<SnapshotGrant | null>(null);

  useEffect(() => {
    if (snapshotProposal && snapshotProposal.choices) {
      // determine choice id for grant
      const choiceId =
        snapshotProposal.choices.findIndex(choice => {
          const split = choice.split(' - ');

          if (split.length < 2) {
            return false;
          }

          return grantId === split[0];
        }) + 1;
      // get score for the grant
      const score = snapshotProposal.scores[choiceId - 1];

      const votes = snapshotProposal.votes.filter(v => v.choice === choiceId);

      setSnapshotGrant({
        choiceId,
        voteCount: score,
        voteStatus: snapshotProposal.scores_state === 'final',
        voteSamples: votes,
        votesAvailable: snapshotProposal.votes_available,
        currentVotes: snapshotProposal.current_vote?.choice === choiceId ? snapshotProposal.current_vote.vp : 0,
      });
    }
  }, [snapshotProposal, grantId]);

  return { snapshotGrant, loading };
}
