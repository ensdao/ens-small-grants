import { Button, Spinner, Typography } from '@ensdomains/thorin';
import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import { useGrants } from '../hooks';
import type { ClickHandler, Round } from '../types';
import { BannerContainer } from './BannerContainer';
import GrantProposalCard from './GrantProposalCard';
import VoteModal from './VoteModal';

const GrantsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['4']};

    width: 100%;
  `
);

export type GrantRoundSectionProps = Round & {
  isPropsOpen?: boolean;
  randomiseGrants?: boolean;
  createProposalHref?: string;
  createProposalClick?: ClickHandler;
};

function GrantRoundSection({
  isPropsOpen,
  randomiseGrants,
  createProposalHref,
  createProposalClick,
  ...round
}: GrantRoundSectionProps) {
  const { address } = useAccount();
  const { grants: _grants, isLoading } = useGrants(round);
  const grants = useMemo(() => {
    if (!_grants || !randomiseGrants) return _grants;
    return _grants.sort(() => 0.5 - Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep track of the selected prop ids for approval voting
  const [selectedProps, setSelectedProps] = useState<number[]>([]);
  const [votingModalOpen, setVotingModalOpen] = useState<boolean>(false);

  if (isLoading) {
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
      {isPropsOpen && (
        <Button as="a" href={createProposalHref} onClick={createProposalClick}>
          Submit Proposal
        </Button>
      )}
      {selectedProps.length > 0 && (
        <Button onClick={() => setVotingModalOpen(true)}>
          Vote for {selectedProps.length} proposal{selectedProps.length > 1 && 's'}
        </Button>
      )}
      {grants &&
        grants.map(g => (
          <GrantProposalCard
            proposal={g}
            selectedProps={selectedProps}
            setSelectedProps={setSelectedProps}
            roundId={round.id}
            votingStarted={round.votingStart < new Date()}
            inProgress={round.votingEnd > new Date()}
            key={g.id}
          />
        ))}

      {address && round?.snapshot?.id && (
        <VoteModal
          open={votingModalOpen}
          onClose={() => setVotingModalOpen(false)}
          proposalId={round.snapshot.id}
          grantIds={selectedProps.map(id => id + 1)}
          address={address}
        />
      )}
    </GrantsContainer>
  );
}

export default GrantRoundSection;
