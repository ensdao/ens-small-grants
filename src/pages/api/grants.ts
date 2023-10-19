import { kysely } from '@/kysely/db';
import { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

export async function getGrantsByUser(address: string) {
  // Fetch the grants from the database
  const grants = await kysely
    .selectFrom('grants')
    .select(['id', 'roundId', 'proposer', 'title', 'description', 'fullText'])
    .where('proposer', 'ilike', address)
    .where('deleted', '=', false)
    .orderBy('id', 'desc')
    .execute();

  return grants;
}

// Zod schema for validating the query params
const schema = z.object({
  address: z.string().min(42).max(42),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const safeParse = schema.safeParse(req.query);

  if (!safeParse.success) {
    return res.status(400).json(safeParse.error);
  }

  const { address } = safeParse.data;
  const grants = await getGrantsByUser(address);
  res.status(200).json(grants);
}
