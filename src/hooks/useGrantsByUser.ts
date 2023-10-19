import { Grant } from '@/kysely/db';

import { useFetch } from './useFetch';

export function useGrantsByUser({ address }: { address: string | undefined }) {
  const { data, error } = useFetch<Grant[]>(address ? `/api/grants?address=${address}` : undefined);

  return { data, error, isLoading: !data && !error };
}
