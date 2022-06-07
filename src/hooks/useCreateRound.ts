import { useCallback, useState } from 'react';

import { functionRequest } from '../supabase';

export function useCreateRound() {
  const [loading, setLoading] = useState(false);

  const createRound = useCallback((name: string, description?: string) => {
    try {
      setLoading(true);
      return functionRequest('create_round', {
        name,
        description,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { createRound, loading };
}
