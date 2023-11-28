import { useCallback, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import z from 'zod';

export const eip712Domain = {
  name: 'ENS Grants',
  version: '1',
  chainId: 1,
};

export const eip712Types = {
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

export const createGrantSchema = z.object({
  roundId: z.number(),
  address: z.string(),
  title: z.string(),
  description: z.string(),
  fullText: z.string(),
  twitter: z.string(),
  payoutAddress: z.string(),
});

export type CreateGrantArgs = z.infer<typeof createGrantSchema>;

export function useCreateGrant() {
  const { data: signer } = useWalletClient();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const createGrant = useCallback(
    async (args: Omit<CreateGrantArgs, 'address'>) => {
      if (signer && address) {
        const grantData = {
          roundId: args.roundId,
          address: address?.toLowerCase(),
          title: args.title,
          description: args.description,
          fullText: args.fullText,
          twitter: args.twitter,
          payoutAddress: args.payoutAddress.toLowerCase(),
        };

        try {
          setLoading(true);

          const signature = await signer.signTypedData({
            domain: eip712Domain,
            types: eip712Types,
            message: grantData,
            primaryType: 'Grant',
          });

          console.log(signature);

          const res = await fetch('api/create/grant', {
            method: 'POST',
            body: JSON.stringify({ grantData, signature }),
          });

          return res;
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
