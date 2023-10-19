import { Grant, kysely } from '@/kysely/db';
import { SnapshotProposalsResponse } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

export async function getRound(id: number) {
  // Fetch the round and grants from the database in a transaction
  const tx = await kysely.transaction().execute(async trx => {
    const round = await trx
      .selectFrom('rounds')
      .selectAll()
      .where('id', '=', id)
      .where('proposalStart', '<', new Date())
      .executeTakeFirstOrThrow();

    const rawGrants = await trx
      .selectFrom('grants')
      .selectAll()
      .where('roundId', '=', id)
      .where('deleted', '=', false)
      .execute()
      .then(res =>
        res.map(grant => {
          // remove payoutAddress from the grant
          const { payoutAddress, ...rest } = grant;
          return rest;
        })
      );

    return { round, rawGrants };
  });

  const { round, rawGrants } = tx;

  // Add a snapshot property to the round
  let snapshotProposal: { scores_total: number; scores_state: string } | undefined = undefined;

  // Add a snapshot property to each grant
  const grants = rawGrants.map(grant => {
    let snapshot: Grant['snapshot'];
    return { ...grant, snapshot };
  });

  // If the round has a snapshotProposalId, fetch the proposal from snapshot
  if (round.snapshotProposalId) {
    const QUERY = `
      query GetSnapshotProposal($proposalId: String!) {
        proposals(where: { id: $proposalId }) {
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
      }).then(res => res.json())) as SnapshotProposalsResponse
    ).data.proposals[0];

    snapshotProposal = {
      scores_total: snapshotResponse.scores_total,
      scores_state: snapshotResponse.scores_state,
    };

    // Match the snapshot choices/scores with the grants
    grants.forEach(grant => {
      // in the snapshotResponse, there's a choices array and a scores array
      // the choices array is an array of strings, where each string is the grant id and the grant name like "1 - Grant Name"
      // first we need to match the choice with the score based on the index
      // then we need to split the choice string into the grant id and grant name, and match the grant id with the grant in the grants array
      // so we can keep track of the snapshot score with the grant from the database

      const indexOfChoice = snapshotResponse.choices.findIndex(
        choice => choice.split(' - ')[0] === grant.id.toString()
      );

      grant.snapshot = { choiceId: indexOfChoice, score: snapshotResponse.scores[indexOfChoice] };
    });
  }

  return { ...round, grants, snapshot: snapshotProposal };
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
  const round = await getRound(id);
  res.status(200).json(round);
}
