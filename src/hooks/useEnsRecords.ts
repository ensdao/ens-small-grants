import { useFetch } from './useFetch';

type EnsRecords = {
  name: string | undefined;
  description: string | undefined;
  twitter: string | undefined;
  github: string | undefined;
};

export const useEnsRecords = (address?: string) => {
  const { data: response } = useFetch<{
    records: {
      texts: Array<{
        key: 'description' | 'com.twitter' | 'com.github';
        type: string;
        value: string;
      }>;
    };
    name: string;
  }>(address ? `https://api.gregskril.com/ens-profile/${address}` : undefined);

  const records = response?.records;

  const ensRecords: EnsRecords = {
    name: response?.name,
    description: records?.texts.find(text => text.key === 'description')?.value,
    twitter: records?.texts.find(text => text.key === 'com.twitter')?.value,
    github: records?.texts.find(text => text.key === 'com.github')?.value,
  };

  return { ensRecords };
};
