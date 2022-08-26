import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://cqlyworkpgzhrdkmntoa.supabase.co';
const SUPABASE_FUNCTIONS_URL =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ?? 'https://cqlyworkpgzhrdkmntoa.supabase.co/rest/v1';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbHl3b3JrcGd6aHJka21udG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgwODg0ODksImV4cCI6MTk3MzY2NDQ4OX0.EkRJCdKlAz_aIPLVxpn5UMj4PHy4hPkV4IAfzjak5Gc';

export const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const functionRequest = (name: string, data?: any) => {
  return fetch(`${SUPABASE_FUNCTIONS_URL}/rpc`, {
    method: 'POST',
    body: JSON.stringify({ method: name, ...data }),
    headers: {
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'content-type': 'application/json',
    },
  });
};
