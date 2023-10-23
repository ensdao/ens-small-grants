import { Round } from '@/kysely/db';
import { useEthersSigner } from '@/wagmi-adapters';
import snapshot from '@snapshot-labs/snapshot.js';
import Arweave from 'arweave';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useAccount, useBlockNumber } from 'wagmi';

const snapshotClient = new snapshot.Client712('https://hub.snapshot.org');

export type CreateSnapshotArgs = {
  roundId: number;
};

export function useCreateSnapshot() {
  const signer = useEthersSigner();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber();
  const [isLoading, setIsLoading] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);

  const createSnapshot = useCallback(
    async (args: CreateSnapshotArgs) => {
      if (signer && address) {
        try {
          setIsLoading(true);

          if (!blockNumber) {
            return new Error('no block number');
          }

          const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
          });

          const round = (await fetch(`/api/round/${args.roundId}`).then(res => res.json())) as Round;

          if (!round) {
            throw new Error('failed to fetch round data');
          }

          const { grants } = round;

          if (!grants) {
            throw new Error('failed to fetch grants');
          }

          const grantsOrdered = grants.sort((a, b) => a.id - b.id);

          const grantsData = grantsOrdered.map(grant => ({
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
              choices: grantsOrdered.map(g => `${g.id} - ${g.title}`),
              discussion: '',
              start: Math.floor(new Date(round.votingStart).getTime() / 1000),
              end: Math.floor(new Date(round.votingEnd).getTime() / 1000),
              snapshot: Number(blockNumber),
              plugins: JSON.stringify({}),
            }
          )) as { id: string };

          setReceipt(receipt.id);
          console.log(receipt);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [address, signer, blockNumber]
  );

  return { createSnapshot, isLoading, receipt };
}
