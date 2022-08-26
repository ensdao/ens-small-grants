import snapshot from '@snapshot-labs/snapshot.js';
import Arweave from 'arweave';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useAccount, useBlockNumber, useSigner } from 'wagmi';

import { client, functionRequest } from '../supabase';

const domain = {
  name: 'ENS Grants',
  version: '1',
  chainId: 1,
};

const types = {
  Snapshot: [
    { name: 'roundId', type: 'uint256' },
    { name: 'snapshotProposalId', type: 'string' },
  ],
};

const snapshotClient = new snapshot.Client712('https://hub.snapshot.org');

export type CreateSnapshotArgs = {
  roundId: number;
};

export function useCreateSnapshot() {
  const { data: signer } = useSigner();
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

          const { data: grants, error } = await client
            .from('grants')
            .select()
            .eq('round_id', args.roundId)
            .eq('deleted', false);

          if (error || !grants) {
            throw new Error('failed to fetch grants');
          }

          const { data: rounds, error: roundsError } = await client.from('rounds').select().eq('id', args.roundId);

          if (roundsError || !rounds || rounds.length !== 1) {
            throw new Error('failed to fetch round data');
          }

          const round = rounds[0];

          const grantsData = grants.map(grant => ({
            proposer: grant.proposer,
            title: grant.title,
            description: grant.description,
            fullText: grant.full_text,
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
              space: round.snapshot_space_id,
              type: 'approval',
              title: round.title,
              body: `https://arweave.net/${transaction.id}`,
              choices: grants.map(g => `${g.id} - ${g.title}`),
              // todo(carlos): insert link to round
              discussion: '',
              start: Math.floor(new Date(round.voting_start).getTime() / 1000),
              end: Math.floor(new Date(round.voting_end).getTime() / 1000),
              snapshot: blockNumber,
              plugins: '{}',
            }
          )) as { id: string };

          const snapshotData = {
            roundId: args.roundId,
            snapshotProposalId: receipt.id,
          };

          // @ts-ignore
          const signature = await signer._signTypedData(domain, types, snapshotData);

          return functionRequest('attach_snapshot', {
            snapshotData,
            signature,
          });
        } finally {
          setLoading(false);
        }
      }
    },
    [address, signer, blockNumber]
  );

  return { createSnapshot, loading };
}
