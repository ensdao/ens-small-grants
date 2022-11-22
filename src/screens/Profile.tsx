import { mq, Avatar, Heading, Spinner } from '@ensdomains/thorin';
import { useParams, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { Description, Title } from '../components/GrantProposalCard';
import { GrantsContainer } from '../components/GrantRoundSection';
import { cardStyles, HeadingContainer } from '../components/atoms';
import { useRounds, useGrantsByUser } from '../hooks';
import type { Grant } from '../types';

const StyledCard = styled('div')(
  cardStyles,
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.space['1']};
    border: 1px solid ${theme.colors.borderSecondary};
    width: 100%;
    transition: all 0.15s ease-in-out;

    &:hover {
      background-color: ${theme.colors.backgroundTertiary};
    }
  `
);

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['20']};
    height: ${theme.space['20']};
  `
);

const Subtitle = styled(Heading)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.extraLarge};
    width: 100%;

    ${mq.md.min(css`
      font-size: ${theme.fontSizes.headingThree};
    `)}
  `
);

export default function Profile() {
  const { address } = useParams<{ address: string }>();
  const { rounds, isLoading: roundsAreLoading } = useRounds();

  const { grants } = useGrantsByUser({ address: address });

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  });

  if (roundsAreLoading || !rounds || !address) {
    return <Spinner size="large" color="purple" />;
  }

  return (
    <>
      <HeadingContainer>
        <AvatarWrapper>
          <Avatar src={ensAvatar || undefined} label={ensName || 'label'} />
        </AvatarWrapper>
        <Heading title={address}>{ensName || `${address.slice(0, 6)}..${address.slice(36, 40)}`}</Heading>
      </HeadingContainer>

      <GrantsContainer>
        <Subtitle as="h2">Proposal History</Subtitle>
        {grants?.map((grant: Grant) => (
          <StyledCard key={grant.id} hasPadding={true}>
            <Link to={`/rounds/${grant.roundId}/proposals/${grant.id}`}>
              <Title>{grant.title}</Title>
              <Description>{grant.description}</Description>
            </Link>
          </StyledCard>
        ))}
      </GrantsContainer>
    </>
  );
}
