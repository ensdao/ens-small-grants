import { useFetch } from './useFetch';

export function useEnsNames(addresses: string[] | undefined) {
  return useFetch<{ name: string; address: string }[] | undefined>(
    addresses && addresses.length > 0 ? 'https://api.gregskril.com/ens-resolve' : undefined,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addresses }),
    }
  );
}
