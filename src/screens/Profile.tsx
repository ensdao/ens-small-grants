import { mq, Avatar, Heading, Spinner, Tag } from '@ensdomains/thorin';
import { useParams, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { Description, Title } from '../components/GrantProposalCard';
import { GrantsContainer } from '../components/GrantRoundSection';
import { cardStyles, HeadingContainer } from '../components/atoms';
import { useRounds, useGrantsByUser } from '../hooks';
import type { Grant } from '../types';
import { getRoundStatus, voteCountFormatter } from '../utils';

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

const RoundMeta = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['2']};
    margin-bottom: ${theme.space['3']};
  `
);

export default function Profile() {
  const { rounds } = useRounds();
  const { address } = useParams<{ address: string }>();
  const { grants } = useGrantsByUser({ address: address });

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });

  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  });

  if (!rounds || !address || !grants) {
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
        <Subtitle as="h2">Proposal history</Subtitle>
        {grants?.map((grant: Grant) => {
          const round = rounds.find(r => r.id === grant.roundId);
          const roundStatus = round && getRoundStatus(round);
          const snapshotChoiceIndex = round?.snapshot?.choices.findIndex(c => Number(c.split(' - ')[0]) === grant.id);
          const votes = round?.snapshot?.scores[snapshotChoiceIndex || 0] || 0;

          return (
            <StyledCard key={grant.id} hasPadding={true}>
              <Link to={`/rounds/${grant.roundId}/proposals/${grant.id}`}>
                <RoundMeta>
                  <Tag tone="accent">
                    {round?.title} Round {round?.round}
                  </Tag>

                  {roundStatus !== 'proposals' && <Tag>{voteCountFormatter.format(votes)} votes</Tag>}
                  {roundStatus !== 'closed' && <Tag tone="green">Active</Tag>}
                </RoundMeta>

                <Title>{grant.title}</Title>
                <Description>{grant.description}</Description>
              </Link>
            </StyledCard>
          );
        })}
      </GrantsContainer>
    </>
  );
}
