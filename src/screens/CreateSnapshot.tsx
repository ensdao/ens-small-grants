import { Box, Button } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useCreateSnapshot } from '../hooks';

export function CreateSnapshot() {
  const { roundId } = useParams<{ roundId: string }>();
  const { createSnapshot } = useCreateSnapshot();

  const create = useCallback(() => {
    if (roundId) {
      createSnapshot({ roundId: Number.parseInt(roundId) });
    }
  }, [createSnapshot, roundId]);

  return (
    <Box>
      <Button onClick={create}>Create Snapshot</Button>
    </Box>
  );
}
