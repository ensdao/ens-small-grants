import { Round, kysely } from '@/kysely/db';
import { NextApiRequest, NextApiResponse } from 'next';

const { countAll } = kysely.fn;

export type AllRounds = Round & {
  grantsCount: number;
};

export async function getRounds() {
  const tx = await kysely.transaction().execute(async tx => {
    // Get all rounds that have started
    const rawRounds = await tx
      .selectFrom('rounds')
      .selectAll()
      .where('proposalStart', '<', new Date())
      .orderBy('id', 'desc')
      .execute();

    // Count the number of grants in each round
    const grantsPerRound = await tx
      .selectFrom('grants')
      .select(['roundId', countAll().as('count')])
      .where('deleted', '=', false)
      .groupBy('roundId')
      .execute();

    return { rawRounds, grantsPerRound };
  });

  const { rawRounds, grantsPerRound } = tx;

  const rounds = rawRounds.map(round => {
    const grantsCount = Number(grantsPerRound.find(grants => grants.roundId === round.id)?.count) ?? 0;
    return { ...round, grantsCount };
  });

  return rounds;
}

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const rounds = await getRounds();

  res.status(200).json(rounds);
}
