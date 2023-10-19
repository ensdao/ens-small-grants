import { Round } from '@/kysely/db';
import snapshot from '@snapshot-labs/snapshot.js';
import Arweave from 'arweave';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useAccount, useBlockNumber, useWalletClient } from 'wagmi';

const snapshotClient = new snapshot.Client712('https://hub.snapshot.org');

export type CreateSnapshotArgs = {
  roundId: number;
};

export function useCreateSnapshot() {
  const { data: signer } = useWalletClient();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber();
  const [loading, setLoading] = useState(false);

  const createSnapshot = useCallback(
    async (args: CreateSnapshotArgs) => {
      if (signer && address) {
        try {
          setLoading(true);

          if (!blockNumber) {
            return new Error('no block number');
          }

          const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
          });

          const round = (await fetch(`/api/round/${args.roundId}`).then(res => res.json())) as Round;

          // const grants = await kysely
          //   .selectFrom('grants')
          //   .select(['id', 'proposer', 'title', 'description', 'fullText'])
          //   .where('roundId', '=', args.roundId)
          //   .where('deleted', '=', false)
          //   .orderBy('createdAt', 'asc')
          //   .execute();

          if (!round) {
            throw new Error('failed to fetch round data');
          }

          const { grants } = round;

          if (!grants) {
            throw new Error('failed to fetch grants');
          }

          // const round = await kysely.selectFrom('rounds').selectAll().where('id', '=', args.roundId).executeTakeFirst();

          const grantsData = grants.map(grant => ({
            proposer: grant.proposer,
            title: grant.title,
            description: grant.description,
            fullText: grant.fullText,
          }));

          const transaction = await arweave.createTransaction({
            data: JSON.stringify(grantsData),
          });
          transaction.addTag('Content-Type', 'application/json');
          transaction.addTag('App-Name', 'ENS-Small-Grants-v1');

          await arweave.transactions.sign(transaction);

          const uploader = await arweave.transactions.getUploader(transaction);

          while (!uploader.isComplete) {
            await uploader.uploadChunk();
          }

          const receipt = (await snapshotClient.proposal(
            signer as unknown as ethers.providers.Web3Provider,
            address || '',
            {
              space: round.snapshotSpaceId,
              type: 'approval',
              title: round.title,
              body: `https://arweave.net/${transaction.id}`,
              choices: grants.map(g => `${g.id} - ${g.title}`),
              // todo(carlos): insert link to round
              discussion: '',
              start: Math.floor(new Date(round.votingStart).getTime() / 1000),
              end: Math.floor(new Date(round.votingEnd).getTime() / 1000),
              snapshot: Number(blockNumber),
              plugins: '{}',
            }
          )) as { id: string };

          console.log(receipt);
        } finally {
          setLoading(false);
        }
      }
    },
    [address, signer, blockNumber]
  );

  return { createSnapshot, loading };
}
