import { mq, Heading, Spinner, Tag } from '@ensdomains/thorin';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import { useEnsAvatar, useEnsName } from 'wagmi';

import TwitterIcon from '../../assets/twitter.svg';
import { Avatar } from '../../components/Avatar';
import { Description, Title } from '../../components/GrantProposalCard';
import { GrantsContainer } from '../../components/GrantRoundSection';
import OpenGraphElements from '../../components/OpenGraphElements';
import { cardStyles, HeadingContainer } from '../../components/atoms';
import { useRounds, useGrantsByUser, useEnsRecords, useSnapshotVotes } from '../../hooks';
import type { Grant } from '../../types';
import { getRoundStatus, shortenAddress, voteCountFormatter } from '../../utils';

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

const HeadingWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['2']};
  `
);

const Icon = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};

    a {
      display: flex;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `
);

const Ul = styled.ul`
  margin-top: 0.25rem;
  list-style: initial;
  margin-inline-start: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

export default function Profile() {
  const router = useRouter();
  const { address } = router.query as { address: string | undefined };
  const { grants } = useGrantsByUser({ address: address });
  const { ensRecords } = useEnsRecords(address);
  const ensName = ensRecords?.name;

  const twitter = ensRecords?.twitter;
  const twitterHandle = twitter?.includes('twitter.com/') ? twitter.split('twitter.com/')[1] : twitter;
  const displayName = ensName || shortenAddress(address);

  const loadingContent = <Spinner size="large" color="purple" />;

  const loadedContent = (
    <>
      <HeadingContainer>
        <AvatarWrapper>
          <Avatar
            src={`https://metadata.ens.domains/mainnet/avatar/${ensName}`}
            label={ensName || shortenAddress(address)}
          />
        </AvatarWrapper>
        <HeadingWrapper>
          <Heading title={address}>{displayName}</Heading>
          {twitter && (
            <Icon>
              <a
                href={`https://twitter.com/${twitterHandle}`}
                title={`@${twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </a>
            </Icon>
          )}
        </HeadingWrapper>
      </HeadingContainer>

      {grants && grants.length > 0 && (
        <GrantsContainer>
          <ProposalHistory grants={grants} />
        </GrantsContainer>
      )}

      <GrantsContainer>
        <VotingHistory address={address} />
      </GrantsContainer>
    </>
  );

  return (
    <>
      <OpenGraphElements title={`${displayName} - ENS Small Grants`} />
      {!address ? loadingContent : loadedContent}
      {}
    </>
  );
}

function ProposalHistory({ grants }: { grants: Grant[] | undefined }) {
  const { rounds } = useRounds();

  if (!grants || !rounds || grants.length === 0) return null;

  return (
    <>
      <Subtitle as="h2">Proposal history</Subtitle>
      {grants?.map((grant: Grant) => {
        const round = rounds.find(r => r.id === grant.roundId);
        const roundStatus = round && getRoundStatus(round);
        const snapshotChoiceIndex = round?.snapshot?.choices.findIndex(c => Number(c.split(' - ')[0]) === grant.id);
        const votes = round?.snapshot?.scores[snapshotChoiceIndex || 0] || 0;

        return (
          <StyledCard as="a" href={`/rounds/${grant.roundId}/proposals/${grant.id}`} key={grant.id} hasPadding={true}>
            <RoundMeta>
              <Tag tone="accent">
                {round?.title} Round {round?.round}
              </Tag>

              {roundStatus !== 'closed' && <Tag tone="green">Active</Tag>}
              {roundStatus !== 'proposals' && <Tag>{voteCountFormatter.format(votes)} votes</Tag>}
            </RoundMeta>

            <Title>{grant.title}</Title>
            <Description>{grant.description}</Description>
          </StyledCard>
        );
      })}
    </>
  );
}

function VotingHistory({ address }: { address?: string }) {
  const { votes: votingHistory } = useSnapshotVotes(address?.toLowerCase());

  if (!votingHistory || votingHistory.length === 0) return null;

  return (
    <>
      <Subtitle as="h2">Voting history</Subtitle>

      {votingHistory.map(vote => {
        const votedPropIndexes = Array.isArray(vote.choice) ? vote.choice : [vote.choice];
        const votedProps: {
          name: string;
          id: number;
        }[] = [];

        vote.proposal.choices.forEach((choice, index) => {
          if (votedPropIndexes.includes(index + 1)) {
            const [id, name] = choice.split(' - ');
            votedProps.push({ name, id: Number(id) });
          }
        });

        return (
          <StyledCard key={vote.proposal.title} hasPadding={true}>
            <Title>{vote.proposal.title}</Title>
            <Ul>
              {votedProps.map(prop => (
                <li key={prop.id}>{prop.name}</li>
              ))}
            </Ul>
          </StyledCard>
        );
      })}
    </>
  );
}
