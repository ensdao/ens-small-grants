import { useState, useEffect } from 'react';

type EnsRecords = {
  description: string;
  twitter: string;
  github: string;
};

export const useEnsRecords = (address?: string) => {
  const [ensRecords, setEnsRecords] = useState<EnsRecords | null>(null);

  useEffect(() => {
    if (!address) return;

    fetch(`https://ens-records.vercel.app/${address}`)
      .then(res => res.json())
      .then(data => setEnsRecords(data))
      .catch(() => null);
  }, [address]);

  return { ensRecords };
};
