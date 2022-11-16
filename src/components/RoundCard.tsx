import { Button, mq, Tag, Typography } from '@ensdomains/thorin';
import { useHref, useLinkClickHandler } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ClickHandler, Round, Status } from '../types';
import { formatEthPerWinner, getRoundStatus, getTimeDifferenceString } from '../utils';
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

const BaseRoundCard = ({ id, title, round, status, children }: BaseProps) => {
  const to = `/rounds/${id}`;
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to);

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
        <Button
          shadowless
          as="a"
          href={href}
          variant={status === 'closed' ? 'secondary' : 'primary'}
          onClick={handleClick as unknown as ClickHandler}
        >
          {status === 'voting' ? 'Vote' : 'View'}
        </Button>
      </div>

      <RoundMeta>
        <MetaItem name="Funding" value={`${formatEthPerWinner(round)} ETH x ${round.maxWinnerCount}`} />

        {status === 'proposals' && (
          <MetaItem name="Prop deadline" value={getTimeDifferenceString(new Date(), round.proposalEnd)} />
        )}

        {status === 'pending-voting' && (
          <MetaItem name="Voting starts" value={getTimeDifferenceString(new Date(), round.votingStart)} />
        )}

        {status === 'voting' && (
          <MetaItem name="Voting ends" value={getTimeDifferenceString(new Date(), round.votingEnd)} />
        )}

        {status === 'closed' && (
          <MetaItem name="Ended" value={getTimeDifferenceString(round.votingEnd, new Date()) + ' ago'} />
        )}

        {round?.snapshot?.choices && (
          <MetaItem name="Proposals" value={round.snapshot.choices.length.toString() || '0'} />
        )}
      </RoundMeta>
    </StyledCard>
  );
};

const MetaItem = ({ name, value }: { name: string; value: string }) => {
  return (
    <div className="meta__item">
      <span className="meta__title">{name}</span>
      <span>{value}</span>
    </div>
  );
};

export const RoundCard = (round: Round) => {
  const status = getRoundStatus(round);

  const baseProps = {
    id: round.id,
    round: round,
    status,
    title: round.title,
  };

  return (
    <BaseRoundCard {...baseProps}>
      <InfoContainer>
        {round.title.includes('Ecosystem') && (
          <Typography>Projects that specifically build on or improve the ENS Ecosystem.</Typography>
        )}
        {round.title.includes('Public Goods') && (
          <Typography>Projects that benefit the entire Ethereum or Web3 space.</Typography>
        )}
      </InfoContainer>
    </BaseRoundCard>
  );
};

export default RoundCard;
