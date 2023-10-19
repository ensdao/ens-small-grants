import { CamelCasePlugin, Generated, Kysely, PostgresDialect, Selectable } from 'kysely';
import { Pool } from 'pg';

export interface Database {
  grants: {
    id: Generated<number>;
    roundId: number;
    proposer: string;
    title: string;
    description: string | null;
    fullText: string;
    deleted: boolean;
    createdAt: Generated<Date>;
    updatedAt: Date;
    twitter: string | null;
    payoutAddress: string | null;
  };

  rounds: {
    id: number;
    creator: string;
    title: string;
    description: string | null;
    snapshotSpaceId: string;
    snapshotProposalId: string | null;
    proposalStart: Date;
    proposalEnd: Date;
    votingStart: Date;
    votingEnd: Date;
    allocationTokenAmount: string;
    allocationTokenAddress: string;
    maxWinnerCount: number;
    createdAt: Date;
    updatedAt: Date;
    houseId: string | null;
    scholarship: boolean | null;
  };

  houses: {
    id: string;
    title?: string;
    slug: string;
    description?: string;
    hidden?: boolean;
    createdAt: Date;
  };
}

export type Grant = Selectable<Database['grants']> & {
  snapshot?:
    | {
        choiceId: number | undefined;
        score: number | undefined;
      }
    | undefined;
};

export type Round = Selectable<Database['rounds']> & {
  grants?: Grant[] | undefined;
  snapshot?:
    | {
        scores_total: number;
        scores_state: string;
      }
    | undefined;
};

export type House = Selectable<Database['houses']>;

export const kysely = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DB_CONNECTION_STRING,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});
