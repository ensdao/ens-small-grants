import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { useCreateSnapshot } from '../hooks';

export function CreateSnapshot() {
  const router = useRouter();
  const { _roundId } = router.query;
  const roundId = _roundId as string;

  const { createSnapshot } = useCreateSnapshot();
  const [_, setLoading] = useState(false);

  const create = useCallback(() => {
    if (roundId) {
      (async () => {
        try {
          setLoading(true);
          await createSnapshot({ roundId: Number.parseInt(roundId) });
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [createSnapshot, roundId]);

  return (
    <div>
      <button onClick={create}>Create Snapshot</button>
    </div>
  );
}
