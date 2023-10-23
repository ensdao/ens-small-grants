import { useCreateSnapshot } from '@/hooks';
import { Button, Helper } from '@ensdomains/thorin';
import { GetServerSidePropsContext } from 'next/types';
import { useCallback, useState } from 'react';
import z from 'zod';

export default function Page({ roundId }: { roundId: number }) {
  const { createSnapshot, isLoading, receipt } = useCreateSnapshot();

  const create = useCallback(() => {
    if (roundId) {
      (async () => {
        try {
          // setLoading(true);
          await createSnapshot({ roundId });
        } finally {
          // setLoading(false);
        }
      })();
    }
  }, [createSnapshot, roundId]);

  return (
    <>
      <Button onClick={create} loading={isLoading} style={{ width: 'fit-content' }}>
        Create Snapshot
      </Button>

      {receipt && (
        <Helper
          style={{
            maxWidth: 'fit-content',
          }}
        >
          {receipt}
        </Helper>
      )}
    </>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  const schema = z.object({ id: z.coerce.number() });
  const { id } = schema.parse(params);

  return {
    props: { roundId: id },
  };
}
