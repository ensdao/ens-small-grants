import { useCallback, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

import { functionRequest } from '../supabase';

const domain = {
  name: 'ENS Grants',
  version: '1',
  chainId: 1,
};

const types = {
  Grant: [
    { name: 'address', type: 'address' },
    { name: 'roundId', type: 'uint256' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'fullText', type: 'string' },
    { name: 'twitter', type: 'string' },
    { name: 'payoutAddress', type: 'string' },
  ],
};

export type CreateGrantArgs = {
  roundId: number;
  title: string;
  description: string;
  fullText: string;
  twitter: string;
  payoutAddress: string;
};

export function useCreateGrant() {
  const { data: signer } = useWalletClient();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const createGrant = useCallback(
    async (args: CreateGrantArgs) => {
      if (signer && address) {
        const grantData = {
          roundId: args.roundId,
          address: address?.toLowerCase(),
          title: args.title,
          description: args.description,
          fullText: args.fullText,
          twitter: args.twitter,
          payoutAddress: args.payoutAddress,
        };

        try {
          setLoading(true);

          // const signature = await signer._signTypedData(domain, types, grantData);
          const signature = await signer.signTypedData({ domain, types, message: grantData, primaryType: 'Grant' });

          return functionRequest('create_grant', {
            grantData,
            signature,
          });
        } finally {
          setLoading(false);
        }
      } else {
        throw new Error('Your wallet must connected to propose a grant.');
      }
    },
    [address, signer]
  );

  return { createGrant, loading };
}
