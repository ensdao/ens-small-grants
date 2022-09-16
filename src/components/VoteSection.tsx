import { mq, Spinner, Typography } from '@ensdomains/thorin';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { useSnapshotProposal } from '../hooks';
import type { Grant, Round } from '../types';
import { voteCountFormatter } from '../utils';
import Profile from './Profile';
import { Card, TextWithHighlight } from './atoms';

export function clipAddress(address: string) {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
}

export type GrantProposalCardProps = {
  round: Round;
  proposal: Grant;
};

export type VoteInProgressSectionProps = {
  round: Round;
  snapshotProposalId: string;
  proposal: Grant;
};

const VotesTypography = styled(TextWithHighlight)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
  `
);

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['3']};
    width: 100%;

    .profile:nth-child(n + 4) {
      display: none;
      ${mq.md.min(css`
        display: flex;
      `)}
    }
  `
);

const TopSection = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
  `
);

const ExtraVotersContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${theme.colors.backgroundSecondary};
    font-weight: bold;
    border-radius: ${theme.radii.large};

    height: ${theme.space['10']};
    width: 100%;
  `
);

const VoterAmountTypography = styled(Typography)<{ $voteCount: number }>(
  ({ $voteCount }) => css`
    &::before {
      content: '+ ${$voteCount - 2} ';
      ${mq.md.min(css`
        content: '+ ${$voteCount - 4} ';
      `)}
    }
  `
);

function VoteInProgressSection({ round, snapshotProposalId, proposal }: VoteInProgressSectionProps) {
  const { proposal: snapshotProposal, isLoading } = useSnapshotProposal(snapshotProposalId);
  const snapshotGrant = useMemo(
    () => snapshotProposal?.grants.find(g => g.grantId === proposal.id),
    [snapshotProposal, proposal.id]
  );

  if (round.votingStart > new Date()) {
    return <Typography>Voting has not started yet</Typography>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!snapshotProposal || !snapshotGrant) {
    return <Typography>Voting has not started yet</Typography>;
  }

  const preVoting = new Date() < round.votingStart;

  if (preVoting) {
    return <Typography>Voting has not started</Typography>;
  }

  return (
    <>
      <Container>
        <TopSection>
          <VotesTypography>
            <b>{voteCountFormatter.format(snapshotGrant.voteCount)}</b> Votes
          </VotesTypography>
        </TopSection>
        {snapshotGrant.voteSamples.slice(0, 4).map(voter => (
          <Profile address={voter.voter} subtitle={`${voteCountFormatter.format(voter.vp)} votes`} key={voter.voter} />
        ))}
        {snapshotGrant.voteSamples.length > 4 && (
          <ExtraVotersContainer>
            <VoterAmountTypography $voteCount={snapshotGrant.voteSamples.length}>others</VoterAmountTypography>
          </ExtraVotersContainer>
        )}
      </Container>
    </>
  );
}

const StyledCard = styled(Card)(
  () => css`
    width: 100%;
    height: min-content;
    grid-area: votes;
  `
);

function VoteSection({ round, proposal }: GrantProposalCardProps) {
  const innerContent: React.ReactNode = !round.snapshot?.id ? (
    <Typography>Voting has not started</Typography>
  ) : (
    <VoteInProgressSection round={round} snapshotProposalId={round.snapshot.id} proposal={proposal} />
  );

  return <StyledCard>{innerContent}</StyledCard>;
}

export default VoteSection;
