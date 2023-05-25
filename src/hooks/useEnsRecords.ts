import { useFetch } from './useFetch';

type APIResponse = {
  name: string;
  address: string;
  avatar: string | null;
  records: {
    [key: string | number]: string;
  };
};

export const useEnsRecords = (address?: string) => {
  const { data: response } = useFetch<APIResponse>(
    address ? `https://api.gregskril.com/ens-profile/${address}` : undefined
  );

  const ensRecords = response;
  return { ensRecords };
};
