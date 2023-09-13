import { Button, mq, Tag, Typography } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';

import { useGrants } from '../hooks';
import { ClickHandler, Grant, Round, Status } from '../types';
import { formatFundingPerWinner, getRoundStatus, getTimeDifferenceString } from '../utils';
import { Card } from './atoms';

export const StyledCard = styled(Card)(
  ({ theme, hasPadding }) => css`
    width: 100%;
    min-height: ${theme.space['60']};

    ${!hasPadding &&
    css`
      padding-top: ${theme.space['4']};

      & > div:not(:last-child) {
        padding-left: ${theme.space['4']};
        padding-right: ${theme.space['4']};
      }
    `}
  `
);

export const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: ${theme.space['2']};
    justify-content: space-between;
    width: 100%;
    padding-bottom: ${theme.space['2']};

    ${mq.lg.min(css`
      flex-direction: row;
      align-items: center;
    `)}
  `
);

const HeadingTextContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `
);

export const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;
  `
);

export const Subtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `
);

const InfoContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: ${theme.space['2']};
    padding-top: ${theme.space['2']};
    width: 100%;
    flex-grow: 1;

    color: ${theme.colors.textTertiary};

    b {
      color: ${theme.colors.text};
    }
  `
);

const RoundMeta = styled.div(
  ({ theme }) => css`
    display: grid;
    gap: ${theme.space['8']};
    align-items: center;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    padding: ${theme.space['4']};
    background-color: ${theme.colors.backgroundSecondary};

    ${mq.sm.max(css`
      grid-template-columns: repeat(2, 1fr);
    `)}

    .meta {
      &__item {
        display: flex;
        flex-direction: column;
        gap: ${theme.space['2']};

        &:last-child {
          ${mq.sm.max(css`
            display: none;
          `)}
        }
      }

      &__title {
        font-size: 14px;
        color: ${theme.colors.textTertiary};
      }
    }
  `
);

type BaseProps = {
  id: number;
  title: string;
  round: Round;
  status: Status;
  children: React.ReactNode;
  grants: Grant[] | undefined;
};

const StatusTag = ({ status }: { status: Status }) => {
  if (status === 'proposals') {
    return <Tag tone="green">Accepting submissions</Tag>;
  }
  if (status === 'pending-voting') {
    return <Tag tone="blue">Voting pending</Tag>;
  }
  if (status === 'voting') {
    return <Tag tone="green">Voting open</Tag>;
  }
  return <Tag tone="secondary">Closed</Tag>;
};

const BaseRoundCard = ({ id, title, round, status, children, grants }: BaseProps) => {
  const href = `/rounds/${id}`;

  return (
    <StyledCard hasPadding={false}>
      <HeadingContainer>
        <HeadingTextContainer>
          <Title>{title}</Title>
          <Subtitle>Round {round.round}</Subtitle>
        </HeadingTextContainer>
        <StatusTag status={status} />
      </HeadingContainer>
      {children}
      <div
        style={{
          width: '100%',
        }}
      >
        <Button shadowless as="a" href={href} variant={status === 'closed' ? 'secondary' : 'primary'}>
          {status === 'voting' ? 'Vote' : 'View'}
        </Button>
      </div>

      <RoundMeta>
        {/* <MetaItem name="Funding" value={`${formatFundingPerWinner(round)} x ${round.maxWinnerCount}`} /> */}
        <MetaItem name="Funding" value={formatFundingPerWinner(round)} />

        {status === 'proposals' && (
          <MetaItem
            name="Prop deadline"
            value={getTimeDifferenceString(new Date(), round.proposalEnd)}
            tooltip={round.proposalEnd.toLocaleString()}
          />
        )}

        {status === 'pending-voting' && (
          <MetaItem
            name="Voting starts"
            value={getTimeDifferenceString(new Date(), round.votingStart)}
            tooltip={round.votingStart.toLocaleString()}
          />
        )}

        {status === 'voting' && (
          <MetaItem
            name="Voting ends"
            value={getTimeDifferenceString(new Date(), round.votingEnd)}
            tooltip={round.votingEnd.toLocaleString()}
          />
        )}

        {status === 'closed' && (
          <MetaItem
            name="Ended"
            value={getTimeDifferenceString(round.votingEnd, new Date()) + ' ago'}
            tooltip={round.votingEnd.toLocaleString()}
          />
        )}

        {grants ? <MetaItem name="Proposals" value={grants.length.toString()} /> : <MetaItem name="" value="" />}
      </RoundMeta>
    </StyledCard>
  );
};

const MetaItem = ({ name, value, tooltip }: { name: string; value: string; tooltip?: string }) => {
  return (
    <div className="meta__item">
      <span className="meta__title">{name}</span>
      <span title={tooltip}>{value}</span>
    </div>
  );
};

export const RoundCard = (round: Round) => {
  const status = getRoundStatus(round);
  const { grants } = useGrants(round);

  const baseProps = {
    id: round.id,
    round: round,
    status,
    title: round.title,
    grants,
  };

  return (
    <BaseRoundCard {...baseProps}>
      <InfoContainer>
        {round.title === 'Ecosystem' && (
          <Typography>Projects that specifically build on or improve the ENS Ecosystem.</Typography>
        )}
        {round.title === 'Public Goods' && (
          <Typography>Projects that benefit the entire Ethereum or Web3 space.</Typography>
        )}
        {round.title === 'Public Goods Scholarships' && (
          <Typography>Individuals who have projects that benefit the entire Ethereum or Web3 space.</Typography>
        )}
      </InfoContainer>
    </BaseRoundCard>
  );
};

export default RoundCard;
