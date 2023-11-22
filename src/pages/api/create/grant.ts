import { createGrantSchema, eip712Domain, eip712Types } from '@/hooks';
import { Database, kysely } from '@/kysely/db';
import { Insertable } from 'kysely';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyTypedData, Address, Hex } from 'viem';
import z from 'zod';

const schema = z.object({
  grantData: createGrantSchema,
  signature: z.string().refine(s => s.length === 132),
});

export default async function createGrant(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body);
  const safeSchema = schema.safeParse(body);

  if (!safeSchema.success) {
    console.log(safeSchema.error);
    return res.status(400).json(safeSchema);
  }

  const { grantData, signature } = safeSchema.data;

  const isValidSignature = await verifyTypedData({
    address: grantData.address as Address,
    domain: eip712Domain,
    types: eip712Types,
    primaryType: 'Grant',
    message: grantData,
    signature: signature as Hex,
  });

  if (!isValidSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    await kysely.transaction().execute(async tx => {
      // Get latest grant id
      const latestGrant = await tx
        .selectFrom('grants')
        .select(['id'])
        .orderBy('id', 'desc')
        .limit(1)
        .executeTakeFirstOrThrow();

      await tx
        .insertInto('grants')
        .values({
          id: latestGrant.id + 1,
          roundId: grantData.roundId,
          proposer: grantData.address,
          title: grantData.title,
          description: grantData.description,
          fullText: grantData.fullText,
          deleted: false,
          updatedAt: new Date(),
          twitter: grantData.twitter,
          payoutAddress: grantData.payoutAddress,
        })
        .execute();
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.log('\n\n\n\n');
    console.log(error);
    return res.status(500).json({ error: 'Error saving to database' });
  }
}
