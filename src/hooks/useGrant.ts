import { useState, useEffect } from 'react';

import { client } from '../supabase';
import type { Grant } from './useGrants';

export function useGrant(grantId: string) {
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);

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

  return {
    grant,
    loading: loading,
  };
}
