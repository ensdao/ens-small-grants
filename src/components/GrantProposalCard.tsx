import { Checkbox, mq, Typography } from '@ensdomains/thorin';
import Link from 'next/link';
import styled, { css, DefaultTheme } from 'styled-components';
import { useEnsAddress, useEnsAvatar } from 'wagmi';

import { useStorage } from '../hooks';
import { Grant, Round, SelectedPropVotes } from '../types';
import { getTimeDifferenceString, voteCountFormatter } from '../utils';
import { StaticProfile } from './Profile';
import { cardStyles } from './atoms';

export type GrantProposalCardProps = {
  round: Round;
  proposal: Grant;
  connectedAccount?: string;
  ensName?: string;
  selectedProps: SelectedPropVotes;
  setSelectedProps: (props: SelectedPropVotes) => void;
  votingStarted: boolean;
  inProgress?: boolean;
  highlighted?: boolean;
};

const StyledCard = styled('div')(
  cardStyles,
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas:
      'profile'
      'content'
      'votes';
    gap: ${theme.space['4']};
    border: 1px solid ${theme.colors.borderSecondary};
    width: 100%;

    transition: all 0.15s ease-in-out;
    &:hover {
      background-color: ${theme.colors.backgroundTertiary};

      & > a:first-child > div {
        background-color: ${theme.colors.background};
      }
    }

    &.selected {
      border: ${theme.borderWidths['0.5']} solid ${theme.colors.blue};
    }

    ${mq.sm.min(css`
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'profile votes'
        'content content';
    `)}

    ${mq.md.min(css`
      grid-template-areas: 'profile content votes';
      grid-template-columns: ${theme.space['52']} 1fr min-content;
    `)}
  `
);

const ScholarshipCard = styled.div(
  cardStyles,
  ({ theme }) => css`
    align-items: center;
    display: flex;
    flex-direction: row;
    padding-right: 1rem;
    border: 1px solid ${theme.colors.borderSecondary};
    transition: all 0.15s ease-in-out;
    gap: ${theme.space['2']};

    &:hover {
      background-color: ${theme.colors.backgroundTertiary};
    }

    &.selected {
      border: ${theme.borderWidths['0.5']} solid ${theme.colors.blue};
    }
  `
);

export const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: bold;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-word;
  `
);

export const Description = styled(Typography)(
  () => css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  `
);

const Votes = styled(Typography)(
  ({ theme, scholarship }: { theme: DefaultTheme; scholarship?: boolean }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    grid-area: votes;
    white-space: nowrap;
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.extraLarge};
    text-align: right;
    b {
      color: ${theme.colors.text};
      padding-right: ${theme.space['1']};
    }

    ${!scholarship &&
    css`
      ${mq.sm.max(css`
        justify-content: flex-start;
        padding-top: ${theme.space['2']};
        border-top: ${theme.borderWidths['0.5']} solid ${theme.colors.borderTertiary};
      `)}
    `}
  `
);

const ProfileWrapper = styled.div(
  ({ theme }) => css`
    grid-area: profile;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    width: ${theme.space['52']};
    min-width: ${theme.space['52']};
    padding: ${theme.space['2']};
    border-radius: ${theme.radii.large};

    background-color: ${theme.colors.backgroundTertiary};

    div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  `
);

const ContentWrapper = styled.div(
  () => css`
    flex-grow: 1;
    grid-area: content;
  `
);

const ScholarshipCardWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0 1rem 1rem;
  width: 100%;
`;

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['12']};
    min-width: ${theme.space['12']};
    height: ${theme.space['12']};
    border-radius: ${theme.radii.full};
    overflow: hidden;
    background: ${theme.colors.gradients.blue};
    position: relative;

    img {
      max-width: 100%;
    }
  `
);

const NameVotes = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: 0.125rem;
    flex-direction: column;

    span {
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.textSecondary};
    }
  `
);

function GrantProposalCard({
  round,
  proposal,
  connectedAccount: address,
  ensName,
  selectedProps,
  setSelectedProps,
  votingStarted,
  inProgress,
  highlighted,
}: GrantProposalCardProps) {
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });
  const { removeItem } = useStorage();
  const to = `/rounds/${round.id}/proposals/${proposal.id}`;

  const styledCardContents = (
    <>
      {!round.scholarship && (
        <Link href={`/profile/${proposal.proposer}`}>
          <ProfileWrapper>
            <StaticProfile
              name={ensName}
              avatar={ensAvatar}
              address={proposal.proposer}
              subtitle={`${getTimeDifferenceString(proposal.createdAt, new Date())} ago`}
            />
          </ProfileWrapper>
        </Link>
      )}

      {!round.scholarship && (
        <ContentWrapper>
          <Link href={to}>
            <Title>{proposal.title}</Title>
            <Description>{proposal.description}</Description>
          </Link>
        </ContentWrapper>
      )}

      {round.scholarship && (
        <ScholarshipCardWrapper href={to}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <AvatarWrapper>{ensAvatar && <img src={ensAvatar} alt="" />}</AvatarWrapper>
          <NameVotes>
            <Title>{proposal.title}</Title>
            {votingStarted && <span>{voteCountFormatter.format(proposal.voteCount!)} votes</span>}
          </NameVotes>
        </ScholarshipCardWrapper>
      )}

      {votingStarted && (
        <Votes scholarship={round.scholarship}>
          {!round.scholarship && (
            <>
              <b>{voteCountFormatter.format(proposal.voteCount!)}</b>votes
            </>
          )}
          {inProgress && address && (
            <div>
              <Checkbox
                label=""
                variant="regular"
                checked={selectedProps.votes.includes(proposal.snapshotId)}
                onChange={e => {
                  // if target is checked, push the proposal id to the array
                  if (e.target.checked) {
                    // Clear session storage and refresh page if the Snapshot ID is not available
                    if (!proposal.snapshotId && proposal.snapshotId !== 0) {
                      removeItem(`round-${round.id}-grants`, 'session');
                      window.location.reload();
                    }

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
            </div>
          )}
        </Votes>
      )}
    </>
  );

  if (round.scholarship) {
    return <ScholarshipCard className={highlighted ? 'selected' : ''}>{styledCardContents}</ScholarshipCard>;
  }

  return (
    <StyledCard hasPadding className={highlighted ? 'selected' : ''}>
      {styledCardContents}
    </StyledCard>
  );
}

export default GrantProposalCard;
