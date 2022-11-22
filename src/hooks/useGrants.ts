import { useQuery } from 'wagmi';

import { client } from '../supabase';
import type { Grant, Round } from '../types';
import { camelCaseToUpperCase, replaceKeysWithFunc } from '../utils';

export function useGrants(
  round: Round | undefined,
  selection: string
): {
  grant: Grant | undefined;
  isLoading: boolean;
  grants: never;
};
export function useGrants(round: Round | undefined): {
  grants: Grant[] | undefined;
  isLoading: boolean;
  grant: never;
};
export function useGrants(round: Round | undefined, selection?: string) {
  const { data: grants, isLoading } = useQuery(
    ['grants', round?.id],
    async () => {
      const { data, error } = await client
        .from('grants')
        .select()
        .eq('round_id', round!.id)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data
        .map(g => {
          let snapshotId = round!.snapshot?.choices.findIndex(c => Number.parseInt(c.split(' - ')[0]) === g.id);
          const _score = round!.snapshot?.scores[snapshotId!];
          const score = !_score || _score === undefined ? 0 : _score;

          return {
            ...replaceKeysWithFunc(g, camelCaseToUpperCase),
            voteCount: score,
            snapshotId: snapshotId && (snapshotId++ ?? 0),
          };
        })
        .sort((a, b) => (a.voteCount === b.voteCount ? 0 : a.voteCount! < b.voteCount! ? 1 : -1)) as Grant[];
    },
    {
      select: data => {
        if (!data) {
          return;
        }
        const dataWithDates = data.map(g => ({
          ...g,
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt),
        }));
        if (selection) {
          return dataWithDates.find(r => r.id === Number.parseInt(selection));
        }
        return dataWithDates;
      },
      enabled: !!round,
    }
  );

  if (selection) return { grant: grants, isLoading };
  return { grants, isLoading };
}

export function useGrantIds(roundId: number) {
  const { data: grants, isLoading } = useQuery(
    ['grants', roundId],
    async () => {
      const { data, error } = await client.from('grants').select('id').eq('round_id', roundId).eq('deleted', false);

      if (error) {
        throw error;
      }

      return data.map(g => g.id);
    },
    {
      enabled: !!roundId,
    }
  );

  return { grants, isLoading };
}

export function useGrantsByUser({ address }: { address: string | undefined }) {
  const { data, isLoading } = useQuery(
    ['grants', address],
    async () => {
      const { data: grants, error } = await client
        .from('grants')
        .select()
        .ilike('proposer', `${address}`)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return grants.map(g => ({
        ...g,
        roundId: g.round_id,
      }));
    },
    {
      enabled: !!address,
    }
  );

  return { grants: data, isLoading };
}
