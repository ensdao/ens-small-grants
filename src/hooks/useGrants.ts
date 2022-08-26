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
      const { data, error } = await client.from('grants').select().eq('round_id', round!.id).eq('deleted', false);

      if (error) {
        throw error;
      }

      return data
        .map(g => {
          const snapshotId = round!.snapshot?.choices.findIndex(c => Number.parseInt(c.split(' - ')[0]) === g.id);
          return {
            ...replaceKeysWithFunc(g, camelCaseToUpperCase),
            voteCount: snapshotId ? round!.snapshot?.scores[snapshotId] : 0,
            snapshotId,
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
