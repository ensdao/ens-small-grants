import { Button, Typography } from '@ensdomains/thorin';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import { useStorage } from '../hooks';
import { useEnsNames } from '../hooks/useEnsNames';
import type { Round, Grant } from '../kysely/db';
import type { SelectedPropVotes } from '../types';
import { getRoundStatus } from '../utils';
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

const ProposalWrapper = styled.div(
  ({ scholarship }: { scholarship?: boolean }) => css`
    display: grid;
    width: 100%;
    gap: 1rem;

    ${scholarship &&
    css`
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    `}
  `
);

export type GrantRoundSectionProps = {
  round: Round;
  createProposalHref?: string;
};

export type GrantsFilterOptions = 'time' | 'votes';

function GrantRoundSection({ round, createProposalHref }: GrantRoundSectionProps) {
  const { address } = useAccount();
  const { getItem, setItem } = useStorage();
  const { openConnectModal } = useConnectModal();
  const [filter, setFilter] = useState<GrantsFilterOptions>('time');
  const [grants, setGrants] = useState(round.grants);

  const roundStatus = getRoundStatus(round);
  const isPropsOpen = roundStatus === 'proposals';
  const randomiseGrants = roundStatus === 'voting';

  // Handle filter
  useMemo(() => {
    if (filter) {
      if (filter === 'time') {
        const sortedGrants = round.grants?.sort((a: Grant, b: Grant) => {
          return a.id - b.id; // ids are in order of submission so it's the same as sorting by time
        });

        setGrants(sortedGrants);
      } else if (filter === 'votes') {
        const sortedGrants = round.grants?.sort((a: Grant, b: Grant) => {
          return (b.snapshot?.score || 0) - (a.snapshot?.score || 0);
        });

        setGrants(sortedGrants);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, round.grants]);

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

  // Keep track of the selected prop ids in local storage
  useEffect(() => {
    if (selectedProps) {
      setItem(`round-${round.id}-votes`, JSON.stringify(selectedProps), 'local');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProps]);

  // Batch resolve ENS names here
  const addressesOfGrantees = grants?.map(grant => grant.proposer);
  const ensProfiles = useEnsNames(addressesOfGrantees);

  if (!grants || grants.length === 0) {
    return (
      <BannerContainer>
        <div>
          <Typography>No proposals here yet</Typography>
          <Typography>You can submit your own proposal until the submissions close.</Typography>
        </div>
        <div>
          <Button as="a" href={createProposalHref}>
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
          variant="secondary"
          size="extraSmall"
          shadowless={true}
          suffix={<b>↓</b>}
          onClick={() => {
            setFilter(filter !== 'votes' ? 'votes' : 'time');
          }}
        >
          {filter !== 'votes' ? 'Sort by votes' : 'Sort by time submitted'}
        </FilterButton>
      )}

      {isPropsOpen && (
        <Button as="a" href={createProposalHref}>
          Submit Proposal
        </Button>
      )}

      {!address && randomiseGrants && (
        <Button variant="secondary" onClick={openConnectModal}>
          Connect wallet to vote
        </Button>
      )}

      {address && randomiseGrants && selectedProps && selectedProps.votes.length === 0 && (
        <Button variant="secondary">Check your favorite proposals</Button>
      )}

      {address && randomiseGrants && selectedProps && selectedProps.votes.length > 0 && (
        <Button onClick={() => setVotingModalOpen(true)}>
          Vote for {selectedProps.votes.length} proposal{selectedProps.votes.length > 1 && 's'}
        </Button>
      )}

      <ProposalWrapper scholarship={round.scholarship || false}>
        {grants &&
          grants.map(g => (
            <GrantProposalCard
              proposal={g}
              selectedProps={selectedProps || { round: round.id, votes: [] }}
              setSelectedProps={setSelectedProps}
              round={round}
              connectedAccount={address}
              votingStarted={new Date(round.votingStart) < new Date()}
              inProgress={new Date(round.votingEnd) > new Date()}
              key={g.id}
              // match the grant proposer with the ENS name's address
              ensName={
                ensProfiles.data?.find(profile => profile.address.toLowerCase() === g.proposer.toLowerCase())?.name
              }
              highlighted={
                // In the voting stage, highlight the selected grants
                // In the completed stage, highlight the winning grants
                randomiseGrants
                  ? selectedProps && selectedProps.votes.includes(g.snapshot?.choiceId || 0)
                  : new Date(round.votingStart) < new Date()
                  ? grants.findIndex(grant => grant.id === g.id) < round.maxWinnerCount
                  : false
              }
            />
          ))}
      </ProposalWrapper>

      {address && round?.snapshotProposalId && (
        <VoteModal
          open={votingModalOpen}
          onClose={() => setVotingModalOpen(false)}
          proposalId={round.snapshotProposalId}
          grantIds={selectedProps?.votes.map(id => id + 1) || []}
          address={address}
        />
      )}
    </GrantsContainer>
  );
}

export default GrantRoundSection;
