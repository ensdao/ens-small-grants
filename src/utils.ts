import { Round } from './types';

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
