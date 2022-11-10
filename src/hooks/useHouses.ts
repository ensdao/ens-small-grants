import { useQuery } from 'wagmi';

import { client } from '../supabase';
import type { House } from '../types';

type HouseData = {
  house?: House | undefined;
  houses?: House[] | undefined;
  isLoading: boolean;
};

export function useHouses({ slug }: { slug?: string }): HouseData {
  const { data: houses, isLoading } = useQuery(['houses'], async () => {
    const { data, error } = await (slug
      ? client.from('houses').select().eq('slug', slug)
      : client.from('houses').select().eq('hidden', false).order('created_at', { ascending: true }));

    if (error) {
      throw error;
    }

    if (!data) {
      return;
    }

    return data;
  });

  if (slug) {
    return { house: houses?.[0], isLoading };
  }

  return {
    houses,
    isLoading,
  };
}
