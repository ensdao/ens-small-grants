import { BigNumber } from 'ethers';
import React from 'react';

export type ClickHandler = React.MouseEventHandler<HTMLButtonElement>;

export type SnapshotVote = {
  id: string;
  voter: string;
  vp: number;
  choice: number[];
};

export type SnapshotGrant = {
  choiceId: number;
  grantId: number;
  voteCount: number;
  voteStatus: boolean;
  voteSamples: SnapshotVote[];
  currentVotes: number;
};

export type SnapshotProposal = {
  id: string;
  title: string;
  space: { id: string };
  choices: string[];
  scores: number[];
  scoresState: string;
  scoresTotal: number;
  votes?: SnapshotVote[];
  votesAvailable?: number | null;
  currentVote?: SnapshotVote | null;
  grants: SnapshotGrant[];
};

export type Round = {
  id: number;
  creator: string;
  title: string;
  round: number;
  houseId: number;
  description?: string | null;
  proposalStart: Date;
  proposalEnd: Date;
  votingStart: Date;
  votingEnd: Date;
  allocationTokenAmount: BigNumber;
  allocationTokenAddress: string;
  maxWinnerCount: number;
  createdAt: Date;
  updatedAt: Date;
  snapshot?: SnapshotProposal;
};

export type Grant = {
  id: number;
  snapshotId: number;
  proposer: string;
  roundId: number;
  title: string;
  description: string;
  fullText: string;
  createdAt: Date;
  updatedAt: Date;
  voteCount: number | null;
  voteStatus?: boolean | null;
  voteSamples?: SnapshotVote[];
};

export type House = {
  id: number;
  slug: string;
  title: string;
  hidden: boolean;
  description: string;
  created_at: Date;
};

export type SelectedPropVotes = {
  round: number;
  votes: number[];
};

export type Status = 'queued' | 'proposals' | 'pending-voting' | 'voting' | 'closed';
