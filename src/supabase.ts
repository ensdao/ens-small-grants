import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
