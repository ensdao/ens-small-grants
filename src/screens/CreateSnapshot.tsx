import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useCreateSnapshot } from '../hooks';

export function CreateSnapshot() {
  const { roundId } = useParams<{ roundId: string }>();
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
