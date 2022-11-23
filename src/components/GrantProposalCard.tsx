import { Checkbox, mq, Typography } from '@ensdomains/thorin';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAccount } from 'wagmi';

import { Grant, SelectedPropVotes } from '../types';
import { getTimeDifferenceString, voteCountFormatter } from '../utils';
import Profile from './Profile';
import { cardStyles } from './atoms';

export type GrantProposalCardProps = {
  roundId: string | number;
  proposal: Grant;
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

    ${mq.xs.min(css`
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

export const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: bold;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
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
  ({ theme }) => css`
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

    ${mq.xs.max(css`
      justify-content: flex-start;
      padding-top: ${theme.space['2']};
      border-top: ${theme.borderWidths['0.5']} solid ${theme.colors.borderTertiary};
    `)}
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

function GrantProposalCard({
  roundId,
  proposal,
  selectedProps,
  setSelectedProps,
  votingStarted,
  inProgress,
  highlighted,
}: GrantProposalCardProps) {
  const { address } = useAccount();
  const to = `/rounds/${roundId}/proposals/${proposal.id}`;

  return (
    <StyledCard hasPadding={true} className={highlighted ? 'selected' : ''}>
      <Link to={`/profile/${proposal.proposer}`}>
        <ProfileWrapper>
          <Profile
            address={proposal.proposer}
            subtitle={`${getTimeDifferenceString(proposal.createdAt, new Date())} ago`}
          />
        </ProfileWrapper>
      </Link>
      <ContentWrapper>
        <Link to={to}>
          <Title>{proposal.title}</Title>
          <Description>{proposal.description}</Description>
        </Link>
      </ContentWrapper>
      {votingStarted && (
        <Votes>
          <b>{voteCountFormatter.format(proposal.voteCount!)}</b>votes
          {inProgress && address && (
            <div>
              <Checkbox
                label=""
                variant="regular"
                checked={selectedProps.votes.includes(proposal.snapshotId)}
                onChange={e => {
                  // if target is checked, push the proposal id to the array
                  if (e.target.checked) {
                    setSelectedProps({
                      round: Number(roundId),
                      votes: [...(selectedProps.votes || []), proposal.snapshotId],
                    });
                  } else {
                    // if target is unchecked, remove the proposal id from the array
                    setSelectedProps({
                      round: Number(roundId),
                      votes: (selectedProps.votes || []).filter(vote => vote !== proposal.snapshotId),
                    });
                  }
                }}
              />
            </div>
          )}
        </Votes>
      )}
    </StyledCard>
  );
}

export default GrantProposalCard;
