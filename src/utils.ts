// import { formatEther, formatUnits } from 'ethers/lib/utils';
import { formatEther } from 'viem';

import { Round, RoundInDatabase, Status } from './types';

export const voteCountFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const camelCaseToUpperCase = (str: string) => str.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());

export const replaceKeysWithFunc = (obj: object, func: (str: string) => string) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [func(key), value]));

export const roundTimestampsToDates = ({ proposalStart, proposalEnd, votingStart, votingEnd, ...round }: Round) => ({
  ...round,
  proposalStart: new Date(proposalStart),
  proposalEnd: new Date(proposalEnd),
  votingStart: new Date(votingStart),
  votingEnd: new Date(votingEnd),
});

export const getTimeDifference = (date1: Date, date2: Date) => {
  const diff = date2.getTime() - date1.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return {
    days,
    hours,
    minutes,
    weeks,
  };
};

export const pluralise = (count: number, word: string) => {
  const pluralised = count > 1 ? `${word}s` : word;
  return `${count} ${pluralised}`;
};

export const getTimeDifferenceString = (date1: Date, date2: Date) => {
  const { days, hours, minutes, weeks } = getTimeDifference(date1, date2);
  if (weeks > 0) {
    return pluralise(weeks, 'week');
  } else if (days > 0) {
    return pluralise(days, 'day');
  } else if (hours > 0) {
    return pluralise(hours, 'hour');
  } else if (minutes > 0) {
    return pluralise(minutes, 'minute');
  } else {
    return 'less than a minute';
  }
};

export const getTimeDifferenceStringShort = (date1: Date, date2: Date) => {
  const { days, hours, minutes, weeks } = getTimeDifference(date1, date2);
  if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return 'less than a minute';
  }
};

export const shortenAddress = (address = '', maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address;
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`;
};

export const getRoundStatus = (round: Round): Status => {
  const now = new Date();

  if (now < round.proposalStart) {
    return 'queued';
  } else if (now < round.proposalEnd) {
    return 'proposals';
  } else if (now < round.votingStart) {
    return 'pending-voting';
  } else if (now < round.votingEnd) {
    return 'voting';
  } else {
    return 'closed';
  }
};

export const formatFundingPerWinner = (round: Round): string => {
  const tokenName = round.allocationTokenAddress === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' ? 'USDC' : 'ETH';

  if (round.allocationTokenAmount) {
    // TODO: re-add logic for prize per winner
    const number =
      tokenName === 'USDC'
        ? Math.floor(round.allocationTokenAmount / 1e6).toString()
        : formatEther(BigInt(round.allocationTokenAmount));

    const endNote = round.scholarship ? '/mo' : '';

    return (
      new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(Number(number)) +
      ' ' +
      tokenName +
      endNote
    );
  } else {
    return 'n/a';
  }
};

export const dateToString = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export function camelCaseRound(r: RoundInDatabase): Round {
  return {
    ...r,
    title: r.title.replace(/ Round.*/, ''),
    round: Number.parseInt(r.title.replace(/.*Round /, '')),
    proposalStart: r.proposal_start,
    proposalEnd: r.proposal_end,
    votingStart: r.voting_start,
    votingEnd: r.voting_end,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    allocationTokenAmount: Number(r.allocation_token_amount),
    allocationTokenAddress: r.allocation_token_address,
    maxWinnerCount: Number(r.max_winner_count),
    houseId: r.house_id,
  };
}
