import { SetOptional } from 'type-fest';
import { formatEther } from 'viem';

import { Grant, Round } from './kysely/db';
import { Status } from './types';

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

export const getTimeDifference = (date1: Date | string, date2: Date | string) => {
  const diff = new Date(date2).getTime() - new Date(date1).getTime();
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

  if (now < new Date(round.proposalStart)) {
    return 'queued';
  } else if (now < new Date(round.proposalEnd)) {
    return 'proposals';
  } else if (now < new Date(round.votingStart)) {
    return 'pending-voting';
  } else if (now < new Date(round.votingEnd)) {
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
        ? Math.floor(Number(round.allocationTokenAmount) / 1e6).toString()
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

export function serializeRound(round: Round) {
  return {
    ...round,
    snapshot: round.snapshot || null,
    proposalStart: round.proposalStart.toISOString(),
    proposalEnd: round.proposalEnd.toISOString(),
    votingStart: round.votingStart.toISOString(),
    votingEnd: round.votingEnd.toISOString(),
    createdAt: round.createdAt.toISOString(),
    updatedAt: round.updatedAt.toISOString(),
  };
}

export function serializeGrant(grant: SetOptional<Grant, 'payoutAddress'>) {
  return {
    ...grant,
    createdAt: grant.createdAt.toISOString(),
    updatedAt: grant.updatedAt.toISOString(),
    snapshot: grant.snapshot || null,
  };
}
