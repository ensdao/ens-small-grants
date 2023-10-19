import { Grant, kysely } from '@/kysely/db';
import { SnapshotProposalResponse } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

export async function getGrant(id: number) {
  const tx = await kysely.transaction().execute(async trx => {
    const baseGrant = await trx
      .selectFrom('grants')
      .selectAll()
      .where('id', '=', id)
      .where('deleted', '=', false)
      .executeTakeFirstOrThrow()
      .then(res => {
        // remove payoutAddress from the grant
        const { payoutAddress, ...rest } = res;
        return rest;
      });

    const round = await trx
      .selectFrom('rounds')
      .selectAll()
      .where('id', '=', baseGrant.roundId)
      .where('proposalStart', '<', new Date())
      .executeTakeFirstOrThrow();

    return { baseGrant, round };
  });

  const { baseGrant, round } = tx;

  // Add a snapshot property to the grant
  let snapshot: Grant['snapshot'];
  const grant = { ...baseGrant, snapshot };

  // If the round has a snapshotProposalId, fetch the proposal from snapshot
  if (round.snapshotProposalId) {
    const QUERY = `
      query GetSnapshotProposal($proposalId: String!) {
        proposal(id: $proposalId) {
          id
          choices
          scores_total
          scores_state
          scores
        }
      }
    `;

    const snapshotResponse = (
      (await fetch('https://hub.snapshot.org/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: QUERY,
          variables: { proposalId: round.snapshotProposalId },
        }),
        headers: {
          'content-type': 'application/json',
        },
      }).then(res => res.json())) as SnapshotProposalResponse
    ).data.proposal;

    // Match the snapshot choices/scores with the grants
    const indexOfChoice = snapshotResponse.choices.findIndex(choice => choice.split(' - ')[0] === grant.id.toString());

    grant.snapshot = {
      score: snapshotResponse.scores[indexOfChoice],
      choiceId: indexOfChoice,
    };
  }

  return { ...grant, round };
}

// Zod schema for validating the request body
const schema = z.object({
  id: z.coerce.number(),
});

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  // Validate the request body against the schema above
  const safeParse = schema.safeParse(req.query);

  // If the validation failed, return an error
  if (!safeParse.success) {
    return res.status(400).json(safeParse.error);
  }

  const { id } = safeParse.data;
  const round = await getGrant(id);
  res.status(200).json(round);
}
