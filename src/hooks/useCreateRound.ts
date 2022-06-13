import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';

import { functionRequest } from '../supabase';

export type CreateRoundArgs = {
  title: string;
  description?: string | null;
  creator: string;
  proposalStart: Date;
  proposalEnd: Date;
  votingStart: Date;
  votingEnd: Date;
  allocationTokenAmount: BigNumber;
  allocationTokenAddress: string;
  maxWinnerCount: number;
};

const dateToTimestamp = (d: Date) => BigNumber.from(Math.floor(d.getTime() / 1000)).toString();

export function useCreateRound() {
  const [loading, setLoading] = useState(false);

  const createRound = useCallback((args: CreateRoundArgs) => {
    try {
      setLoading(true);
      return functionRequest('create_round', {
        title: args.title,
        description: args.description,
        creator: args.creator,
        proposalStart: dateToTimestamp(args.proposalStart),
        propsalEnd: dateToTimestamp(args.proposalEnd),
        votingStart: dateToTimestamp(args.votingStart),
        votingEnd: dateToTimestamp(args.votingEnd),
        tokenAllocationAmount: args.allocationTokenAmount.toString(),
        tokenAllocationSourceAddress: args.allocationTokenAddress,
        maxWinnerCount: args.maxWinnerCount,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { createRound, loading };
}
