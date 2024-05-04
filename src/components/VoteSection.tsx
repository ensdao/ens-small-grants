import type { Grant, Round } from '@/kysely/db';
import { Button, Checkbox, Dialog, mq, Spinner, Typography } from '@ensdomains/thorin';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import { useStorage } from '../hooks';
import { useSnapshotProposal } from '../hooks';
import type { SelectedPropVotes, SnapshotVote } from '../types';
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
    width: 100%;
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

    .profile:nth-child(n + 5) {
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
    transition: all 0.1s ease-in-out;

    &:hover {
      cursor: pointer;
      background-color: #e6e6ec;
    }
  `
);

const VoterAmountTypography = styled(Typography)<{ $voteCount: number }>(
  ({ $voteCount }) => css`
    &::before {
      content: '+ ${$voteCount - 3} ';
      ${mq.md.min(css`
        content: '+ ${$voteCount - 5} ';
      `)}
    }
  `
);

function VoteInProgressSection({ round, snapshotProposalId, proposal }: VoteInProgressSectionProps) {
  const { address } = useAccount();
  const { proposal: snapshotProposal, isLoading } = useSnapshotProposal(snapshotProposalId);
  const snapshotGrant = useMemo(
    () => snapshotProposal?.grants.find(g => g.grantId === proposal.id),
    [snapshotProposal, proposal.id]
  );

  const { getItem, setItem } = useStorage();
  const [votersModalOpen, setVotersModalOpen] = useState<boolean>(false);
  const [votingModalOpen, setVotingModalOpen] = useState<boolean>(false);
  const [selectedProps, setSelectedProps] = useState<SelectedPropVotes>(
    getItem(`round-${round.id}-votes`, 'local')
      ? JSON.parse(getItem(`round-${round.id}-votes`, 'local'))
      : {
          round: round.id,
          votes: [],
        }
  );

  // Save selected props to local storage
  useEffect(() => {
    if (round.id && selectedProps) {
      setItem(`round-${round.id}-votes`, JSON.stringify(selectedProps), 'local');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id, selectedProps]);

  if (new Date(round.votingStart) > new Date()) {
    return <Typography>Voting has not started yet</Typography>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!snapshotProposal || !snapshotGrant) {
    // Temporary patch for round 37, link to Snapshot
    return (
      <Button as="a" href={`https://snapshot.org/#/${round.snapshotSpaceId}/proposal/${round.snapshotProposalId}`}>
        Vote on Snapshot
      </Button>
    );
    // return <Typography>Voting has not started yet</Typography>;
  }

  const preVoting = new Date() < new Date(round.votingStart);
  const votingOver = new Date(round.votingEnd) < new Date();

  if (preVoting) {
    return <Typography>Voting has not started</Typography>;
  }

  return (
    <>
      <Container>
        <TopSection>
          <VotesTypography>
            <b>
              {proposal.snapshot?.score !== undefined ? voteCountFormatter.format(proposal.snapshot?.score) : 'Unknown'}
            </b>{' '}
            Votes
          </VotesTypography>

          {!votingOver && address && (
            <Checkbox
              label=""
              variant="regular"
              checked={
                proposal.snapshot?.choiceId !== undefined ? selectedProps.votes.includes(proposal.snapshot.choiceId) : undefined
              }
              onChange={e => {
                // if target is checked, push the proposal id to the array
                if (e.target.checked) {
                  if (proposal.snapshot?.choiceId === undefined) return alert('Proposal choice id not found');

                  setSelectedProps({
                    round: Number(round.id),
                    votes: [...(selectedProps.votes || []), proposal.snapshot.choiceId],
                  });
                } else {
                  if (proposal.snapshot?.choiceId === undefined) return alert('Proposal choice id not found');

                  // if target is unchecked, remove the proposal id from the array
                  setSelectedProps({
                    round: Number(round.id),
                    votes: (selectedProps.votes || []).filter(vote => vote !== proposal?.snapshot?.choiceId),
                  });
                }
              }}
            />
          )}
        </TopSection>

        {address && selectedProps.votes.length > 0 && (
          <Button
            variant={selectedProps.votes.includes(proposal.snapshot?.choiceId || 0) ? 'primary' : 'secondary'}
            disabled={!selectedProps.votes.includes(proposal.snapshot?.choiceId!) || votingOver}
            size="small"
            onClick={() => setVotingModalOpen(true)}
          >
            Vote for {selectedProps.votes.length} proposal{selectedProps.votes.length > 1 && 's'}
          </Button>
        )}

        {snapshotGrant.voteSamples.slice(0, 5).map(voter => {
          if (proposal.snapshot?.choiceId === undefined) {
            return <Profile key={voter.voter} address={voter.voter} subtitle="Unknown votes" />;
          }

          const votesForChoice = voter.choice[proposal.snapshot.choiceId + 1];

          // Use voting power for approval voting and votesForChoice for ranked choice voting
          // This is hardcoded for now with roundId >= 30 because we don't have a way to know which voting method is used
          // TODO: Add a way to know which voting method is used (also in <VoteModal />)
          return (
            <Link href={`/profile/${voter.voter}`} key={voter.voter}>
              <Profile
                address={voter.voter}
                // subtitle={`${voteCountFormatter.format(proposal.roundId >= 30 ? votesForChoice : voter.vp)} votes`}
              />
            </Link>
          );
        })}

        {snapshotGrant.voteSamples.length > 5 && (
          <ExtraVotersContainer onClick={() => setVotersModalOpen(true)}>
            <VoterAmountTypography $voteCount={snapshotGrant.voteSamples.length}>others</VoterAmountTypography>
          </ExtraVotersContainer>
        )}
      </Container>

      <VotersModal
        isOpen={votersModalOpen}
        setIsOpen={setVotersModalOpen}
        voters={snapshotGrant.voteSamples}
        proposal={proposal}
      />

      {address && round.snapshotProposalId && (
        <VoteModal
          open={votingModalOpen}
          onClose={() => setVotingModalOpen(false)}
          proposalId={round.snapshotProposalId}
          grantIds={selectedProps?.votes.map(id => id + 1) || []}
          address={address}
        />
      )}
    </>
  );
}

const StyledCard = styled(Card)(
  () => css`
    width: 100%;
    height: min-content;
  `
);

function VoteSection({ round, proposal }: GrantProposalCardProps) {
  const innerContent: React.ReactNode = !round.snapshotProposalId ? (
    <Typography>Voting has not started</Typography>
  ) : (
    <VoteInProgressSection round={round} snapshotProposalId={round.snapshotProposalId} proposal={proposal} />
  );

  return <StyledCard hasPadding={true}>{innerContent}</StyledCard>;
}

const VotersModalContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    width: 100%;
    max-height: 70vh;
    overflow: scroll;
    align-items: flex-start;
  `
);

function VotersModal({
  isOpen,
  setIsOpen,
  voters,
  proposal,
}: {
  isOpen: boolean;
  setIsOpen: (props: boolean) => void;
  voters: SnapshotVote[];
  proposal: Grant;
}) {
  return (
    <Dialog open={isOpen} variant="blank" onDismiss={() => setIsOpen(false)}>
      <VotersModalContent>
        {voters.map(voter => {
          if (proposal.snapshot?.choiceId === undefined) {
            return <Profile key={voter.voter} address={voter.voter} subtitle="Unknown votes" />;
          }

          const votesForChoice = voter.choice[proposal.snapshot.choiceId + 1];

          return (
            <Link href={`/profile/${voter.voter}`} key={voter.voter}>
              <Profile
                address={voter.voter}
                // subtitle={`${voteCountFormatter.format(proposal.id >= 30 ? votesForChoice : voter.vp)} votes`}
              />
            </Link>
          );
        })}
      </VotersModalContent>
    </Dialog>
  );
}

export default VoteSection;
