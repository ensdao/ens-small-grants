import snapshot from '@snapshot-labs/snapshot.js';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSigner, useAccount } from 'wagmi';

export type SnapshotVote = {
  id: string;
  voter: string;
  vp: number;
  choice: number;
};

export type SnapshotProposal = {
  id: string;
  title: string;
  space: string;
  choices: string[];
  scores: number[];
  scores_state: string;
  votes: SnapshotVote[];
  votes_available?: number | null;
  current_vote?: SnapshotVote | null;
};

const QUERY = `
    query GetSnapshotProposal($proposalId: String!, $currentUser: String) {
      proposal(id: $proposalId) {
        id
        title
        choices
        scores
        scores_state
        snapshot
        space {
          id
        }
        strategies {
          network
          name
          params
        }
      }

      votes(first: 100, where: { proposal: $proposalId }) {
        id
        voter
        vp
        choice
      }

      currentVote: votes(first: 1, where: { proposal: $proposalId, voter: $currentUser }) {
        id
        voter
        vp
        choice
      }
    }
`;

const snapshotClient = new snapshot.Client712('https://hub.snapshot.org');

export function useSnapshotProposal(proposalId: string) {
  const [proposal, setProposal] = useState<SnapshotProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('https://hub.snapshot.org/graphql', {
          method: 'POST',
          body: JSON.stringify({ query: QUERY, variables: { proposalId, currentUser: account?.address } }),
          headers: {
            'content-type': 'application/json',
          },
        });

        const body = await res.json();

        let votes_available: number | null = null;

        if (account && account.address) {
          const scores = await snapshot.utils.getScores(
            body.data.proposal.space.id,
            body.data.proposal.strategies,
            '1',
            [account.address],
            body.data.proposal.snapshot
          );

          votes_available = Math.floor(scores[0][account.address] ?? 0);
        }

        setProposal({
          ...body.data.proposal,
          votes: body.data.votes,
          votes_available,
          current_vote: body.data.currentVote,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [proposalId, account]);

  const vote = useCallback(
    async (choiceId: number) => {
      if (proposal && account?.address) {
        await snapshotClient.vote(signer as unknown as ethers.providers.Web3Provider, account.address, {
          type: 'single-choice',
          space: proposal?.space,
          proposal: proposalId,
          choice: choiceId,
        });
      }
    },
    [proposalId, account, proposal, signer]
  );

  return { proposal, loading, vote };
}
