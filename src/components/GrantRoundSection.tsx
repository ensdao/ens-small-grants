import { Spinner } from '@ensdomains/thorin';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { useGrants } from '../hooks';
import type { Round } from '../types';
import GrantProposalCard from './GrantProposalCard';

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
  randomiseGrants?: boolean;
};

function GrantRoundSection({ randomiseGrants, ...round }: GrantRoundSectionProps) {
  const { grants: _grants, isLoading } = useGrants(round);
  const grants = useMemo(() => {
    if (!_grants || !randomiseGrants) return _grants;
    return _grants.sort(() => 0.5 - Math.random());
  }, [_grants, randomiseGrants]);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  return (
    <GrantsContainer>
      {grants &&
        grants.map(g => (
          <GrantProposalCard proposal={g} roundId={round.id} inProgress={round.votingEnd > new Date()} key={g.id} />
        ))}
    </GrantsContainer>
  );
}

export default GrantRoundSection;
