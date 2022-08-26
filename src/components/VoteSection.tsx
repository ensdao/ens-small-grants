import { Button, mq, Spinner, Typography } from '@ensdomains/thorin';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import { useSnapshotProposal } from '../hooks';
import type { Grant, Round } from '../types';
import { voteCountFormatter } from '../utils';
import Profile from './Profile';
import VoteModal from './VoteModal';
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
  const [openVoteModal, setOpenVoteModal] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { proposal: snapshotProposal, vote, isLoading } = useSnapshotProposal(snapshotProposalId);
  const snapshotGrant = useMemo(
    () => snapshotProposal?.grants.find(g => g.grantId === proposal.id),
    [snapshotProposal, proposal.id]
  );

  const executeVote = useCallback(async () => {
    if (snapshotGrant) {
      await vote(snapshotGrant.choiceId);
      setOpenVoteModal(false);
    }
  }, [vote, snapshotGrant, setOpenVoteModal]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!snapshotProposal || !snapshotGrant) {
    return <Typography>Voting has not started yet</Typography>;
  }

  const preVoting = new Date() < round.votingStart;
  const roundIsClosed = !!snapshotGrant.voteStatus || new Date() >= round.votingEnd;

  if (preVoting) {
    return <Typography>Voting has not started</Typography>;
  }

  const currentVoter = {
    voterAddr: address,
    grantProposalId: proposal.id,
    voteCountForGrantProposal: snapshotGrant.currentVotes, // this will be > 0 if they voted for this proposal
    votingPower: snapshotProposal.votesAvailable ?? 0,
    remainingVotingPower: snapshotProposal.votesAvailable ?? 0, // this will be 0 if they voted on another proposal
  };

  const userHasVotingPower = address && currentVoter?.votingPower > 0;
  const userVotedForCurrentProposal = userHasVotingPower && currentVoter.voteCountForGrantProposal > 0;

  let actionButton: React.ReactNode;

  if (roundIsClosed) {
    actionButton = (
      <Button shadowless size="small" disabled>
        Voting closed
      </Button>
    );
  } else if (!address) {
    actionButton = (
      <Button shadowless size="small" onClick={openConnectModal}>
        Connect
      </Button>
    );
  } else if (userVotedForCurrentProposal) {
    actionButton = (
      <Button shadowless size="small" disabled>
        Voted
      </Button>
    );
  } else {
    actionButton = (
      <Button shadowless size="small" onClick={() => setOpenVoteModal(true)}>
        Vote
      </Button>
    );
  }

  return (
    <>
      <Container>
        <TopSection>
          <VotesTypography>
            <b>{voteCountFormatter.format(snapshotGrant.voteCount)}</b> Votes
          </VotesTypography>
          <div>{actionButton}</div>
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
      {!roundIsClosed && !!address && (
        <VoteModal
          address={address}
          onClose={() => setOpenVoteModal(false)}
          open={openVoteModal}
          onVote={executeVote}
          proposal={proposal}
          votingPower={currentVoter.votingPower}
        />
      )}
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
