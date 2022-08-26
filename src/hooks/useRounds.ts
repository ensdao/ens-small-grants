import { BigNumber } from 'ethers';
import { useQuery } from 'wagmi';

import { client } from '../supabase';
import type { Round } from '../types';
import { camelCaseToUpperCase, replaceKeysWithFunc, roundTimestampsToDates } from '../utils';

type SnapshotProposalResponse = {
  data: {
    proposals: {
      id: string;
      choices: string[];
      scores_total: number;
      scores_state: string;
      scores: number[];
    }[];
  };
};

const QUERY = `
    query GetAllSnapshotProposals($spaceId: String!) {
      proposals(where: { space: $spaceId }) {
        id
        choices
        scores_total
        scores_state
        scores
      }
    }
`;

export function useRounds(selection: string): {
  round: Round | undefined;
  isLoading: boolean;
  rounds: never;
};
export function useRounds(): {
  rounds: Round[] | undefined;
  isLoading: boolean;
  round: never;
};
export function useRounds(selection?: string) {
  const { data: rounds, isLoading } = useQuery(
    ['rounds'],
    async () => {
      const { data, error } = await client.from('rounds').select();
      if (error) {
        throw error;
      }

      if (!data) {
        return;
      }

      const body = (await fetch('https://hub.snapshot.org/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: QUERY,
          variables: { spaceId: data[0].snapshot_space_id },
        }),
        headers: {
          'content-type': 'application/json',
        },
      }).then(res => res.json())) as SnapshotProposalResponse;

      for (const roundItem of body.data.proposals) {
        const ref = data.find(r => r.snapshot_proposal_id === roundItem.id);
        if (ref) {
          const scores: number[] = [];

          for (const i in roundItem.choices) {
            const id = Number.parseInt(i.split('-')[0]);
            scores[id] = roundItem.scores[id];
          }

          ref.snapshot = {
            id: ref.snapshot_proposal_id,
            title: ref.title,
            space: { id: ref.snapshot_space_id },
            choices: roundItem.choices,
            scores,
            scoresState: roundItem.scores_state,
            scoresTotal: roundItem.scores_total,
          };
        }
      }

      return data.map(r => ({
        ...replaceKeysWithFunc(r, camelCaseToUpperCase),
        title: r.title.replace(/ Round.*/, ''),
        round: Number.parseInt(r.title.replace(/.*Round /, '')),
        proposalStart: new Date(r.proposal_start),
        proposalEnd: new Date(r.proposal_end),
        votingStart: new Date(r.voting_start),
        votingEnd: new Date(r.voting_end),
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
        allocationTokenAmount: BigNumber.from(r.allocation_token_amount),
      })) as Round[];
    },
    {
      select: data => {
        if (!data) {
          return;
        }
        const dataWithDates = data.map(r => roundTimestampsToDates(r));
        if (selection) {
          return dataWithDates.find(r => r.id === Number.parseInt(selection));
        }
        return dataWithDates;
      },
    }
  );

  if (selection) return { round: rounds, isLoading };
  return { rounds, isLoading };
}
