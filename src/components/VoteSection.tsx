import { Button, Checkbox, Dialog, mq, Spinner, Typography } from '@ensdomains/thorin';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import { useStorage } from '../hooks';
import { useSnapshotProposal } from '../hooks';
import { useEnsNames } from '../hooks/useEnsNames';
import type { Grant, Round, SelectedPropVotes, SnapshotVote } from '../types';
import { voteCountFormatter } from '../utils';
import { StaticProfile } from './Profile';
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

  const addressesOfVoters = snapshotGrant?.voteSamples.map(voter => voter.voter).slice(0, 5);
  const ensProfiles = useEnsNames(addressesOfVoters);

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
  const votingOver = round.votingEnd < new Date();

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
          {!votingOver && address && (
            <Checkbox
              label=""
              variant="regular"
              checked={selectedProps.votes.includes(proposal.snapshotId)}
              onChange={e => {
                // if target is checked, push the proposal id to the array
                if (e.target.checked) {
                  setSelectedProps({
                    round: Number(round.id),
                    votes: [...(selectedProps.votes || []), proposal.snapshotId],
                  });
                } else {
                  // if target is unchecked, remove the proposal id from the array
                  setSelectedProps({
                    round: Number(round.id),
                    votes: (selectedProps.votes || []).filter(vote => vote !== proposal.snapshotId),
                  });
                }
              }}
            />
          )}
        </TopSection>
        {address && selectedProps.votes.length > 0 && (
          <Button
            variant={selectedProps.votes.includes(proposal.snapshotId) ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setVotingModalOpen(true)}
          >
            Vote for {selectedProps.votes.length} proposal{selectedProps.votes.length > 1 && 's'}
          </Button>
        )}
        {snapshotGrant.voteSamples.slice(0, 5).map(voter => (
          <Link to={`/profile/${voter.voter}`} key={voter.voter}>
            <StaticProfile
              name={ensProfiles?.data?.find(profile => profile.address === voter.voter)?.name}
              address={voter.voter}
              subtitle={`${voteCountFormatter.format(voter.vp)} votes`}
            />
          </Link>
        ))}
        {snapshotGrant.voteSamples.length > 5 && (
          <ExtraVotersContainer onClick={() => setVotersModalOpen(true)}>
            <VoterAmountTypography $voteCount={snapshotGrant.voteSamples.length}>others</VoterAmountTypography>
          </ExtraVotersContainer>
        )}
      </Container>

      <VotersModal isOpen={votersModalOpen} setIsOpen={setVotersModalOpen} voters={snapshotGrant.voteSamples} />

      {address && round.snapshot?.id && (
        <VoteModal
          open={votingModalOpen}
          onClose={() => setVotingModalOpen(false)}
          proposalId={round.snapshot.id}
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
  const innerContent: React.ReactNode = !round.snapshot?.id ? (
    <Typography>Voting has not started</Typography>
  ) : (
    <VoteInProgressSection round={round} snapshotProposalId={round.snapshot.id} proposal={proposal} />
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
}: {
  isOpen: boolean;
  setIsOpen: (props: boolean) => void;
  voters: SnapshotVote[];
}) {
  const addressesOfVoters = voters.map(voter => voter.voter);
  const ensProfiles = useEnsNames(addressesOfVoters);

  return (
    <Dialog open={isOpen} variant="blank" onDismiss={() => setIsOpen(false)}>
      <VotersModalContent>
        {voters.map(voter => (
          <Link to={`/profile/${voter.voter}`} key={voter.voter}>
            <StaticProfile
              name={ensProfiles?.data?.find(profile => profile.address === voter.voter)?.name}
              address={voter.voter}
              subtitle={`${voteCountFormatter.format(voter.vp)} votes`}
            />
          </Link>
        ))}
      </VotersModalContent>
    </Dialog>
  );
}

export default VoteSection;
