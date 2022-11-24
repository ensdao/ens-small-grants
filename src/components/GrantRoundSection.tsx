import { Button, Spinner, Typography } from '@ensdomains/thorin';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import { useGrants, useStorage } from '../hooks';
import type { ClickHandler, Grant, Round, SelectedPropVotes } from '../types';
import { BannerContainer } from './BannerContainer';
import GrantProposalCard from './GrantProposalCard';
import VoteModal from './VoteModal';

export const GrantsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['4']};

    width: 100%;
  `
);

const FilterButton = styled(Button)(
  ({ theme }) => css`
    align-self: flex-start;
    width: fit-content;
    padding: ${theme.space['2']} ${theme.space['4']};
  `
);

export type GrantRoundSectionProps = Round & {
  isPropsOpen?: boolean;
  randomiseGrants?: boolean;
  createProposalHref?: string;
  createProposalClick?: ClickHandler;
};

export type GrantsFilterOptions = 'random' | 'votes';

function GrantRoundSection({
  isPropsOpen,
  randomiseGrants,
  createProposalHref,
  createProposalClick,
  ...round
}: GrantRoundSectionProps) {
  const { address } = useAccount();
  const { getItem, setItem } = useStorage();
  const { openConnectModal } = useConnectModal();
  const [filter, setFilter] = useState<GrantsFilterOptions | null>(null);
  const [grants, setGrants] = useState<Grant[]>([]);
  const { grants: _grants, isLoading } = useGrants(round);

  useEffect(() => {
    if (_grants && _grants.length > grants.length) {
      // There are _grants loaded but we haven't set grants
      if (randomiseGrants) {
        // We want to randomise the grants
        const storedGrants = getItem(`round-${round.id}-grants`, 'session');

        if (storedGrants) {
          // If we've already shuffled the grants, use the shuffled grants
          const json = JSON.parse(storedGrants);
          json.map((g: Grant) => {
            g.createdAt = new Date(g.createdAt);
            g.updatedAt = new Date(g.updatedAt);
            return g;
          });
          setGrants(json);
        } else {
          // If we don't have shuffled grants yet: shuffle them, set them as grants, and save them in the session
          const shuffledGrants = _grants.sort(() => 0.5 - Math.random());
          setGrants(shuffledGrants);
          setItem(`round-${round.id}-grants`, JSON.stringify(shuffledGrants), 'session');
        }
      } else {
        // Otherwise, just set the grants as they come from the hook
        setGrants(_grants);
      }
    }
  }, [_grants, getItem, grants, randomiseGrants, round.id, setItem]);

  // Handle filter
  useEffect(() => {
    if (_grants && filter) {
      if (filter === 'votes') {
        setGrants(_grants);
      } else {
        const shuffledGrants = _grants.sort(() => 0.5 - Math.random());
        setItem(`round-${round.id}-grants`, JSON.stringify(shuffledGrants), 'session');
        setGrants(shuffledGrants);
        setFilter(null);
      }
    }

    setItem('grants-filter', filter || 'random', 'session');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_grants, filter]);

  // Keep track of the selected prop ids for approval voting
  const [selectedProps, setSelectedProps] = useState<SelectedPropVotes>(
    getItem(`round-${round.id}-votes`, 'local')
      ? JSON.parse(getItem(`round-${round.id}-votes`, 'local'))
      : {
          round: round.id,
          votes: [],
        }
  );
  const [votingModalOpen, setVotingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProps) {
      setItem(`round-${round.id}-votes`, JSON.stringify(selectedProps), 'local');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProps, round]);

  if (isLoading || (_grants && _grants.length > grants.length)) {
    return <Spinner size="large" />;
  }

  if (!grants || grants.length === 0) {
    return (
      <BannerContainer>
        <div>
          <Typography>No proposals here yet</Typography>
          <Typography>You can submit your own proposal until the submissions close.</Typography>
        </div>
        <div>
          <Button as="a" href={createProposalHref} onClick={createProposalClick}>
            Submit Proposal
          </Button>
        </div>
      </BannerContainer>
    );
  }

  return (
    <GrantsContainer>
      {randomiseGrants && (
        <FilterButton
          tone="blue"
          variant="secondary"
          size="extraSmall"
          shadowless={true}
          suffix={<b>↓</b>}
          onClick={() => {
            setFilter(filter !== 'votes' ? 'votes' : 'random');
          }}
        >
          {filter !== 'votes' ? 'Sort by votes' : 'Shuffle order'}
        </FilterButton>
      )}
      {isPropsOpen && (
        <Button as="a" href={createProposalHref} onClick={createProposalClick}>
          Submit Proposal
        </Button>
      )}
      {!address && randomiseGrants && (
        <Button variant="secondary" onClick={openConnectModal}>
          Connect wallet to vote
        </Button>
      )}
      {address && randomiseGrants && selectedProps && selectedProps.votes.length === 0 && (
        <Button variant="secondary">Check the grants you'd like to vote for</Button>
      )}
      {address && randomiseGrants && selectedProps && selectedProps.votes.length > 0 && (
        <Button onClick={() => setVotingModalOpen(true)}>
          Vote for {selectedProps.votes.length} proposal{selectedProps.votes.length > 1 && 's'}
        </Button>
      )}
      {grants &&
        grants.map(g => (
          <GrantProposalCard
            proposal={g}
            selectedProps={selectedProps || { round: round.id, votes: [] }}
            setSelectedProps={setSelectedProps}
            roundId={round.id}
            votingStarted={round.votingStart < new Date()}
            inProgress={round.votingEnd > new Date()}
            key={g.id}
            highlighted={
              // In the voting stage, highlight the selected grants
              // In the completed stage, highlight the winning grants
              randomiseGrants
                ? selectedProps && selectedProps.votes.includes(g.snapshotId)
                : round.votingStart < new Date()
                ? grants.findIndex(grant => grant.id === g.id) < round.maxWinnerCount
                : false
            }
          />
        ))}

      {address && round?.snapshot?.id && (
        <VoteModal
          open={votingModalOpen}
          onClose={() => setVotingModalOpen(false)}
          proposalId={round.snapshot.id}
          grantIds={selectedProps?.votes.map(id => id + 1) || []}
          address={address}
        />
      )}
    </GrantsContainer>
  );
}

export default GrantRoundSection;
