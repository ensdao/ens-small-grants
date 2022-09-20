import { Button, mq, Tag, Typography } from '@ensdomains/thorin';
import { useHref, useLinkClickHandler } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ClickHandler, Round } from '../types';
import { getTimeDifferenceString } from '../utils';
import { Card } from './atoms';

const StyledCard = styled(Card)(
  ({ theme }) => css`
    width: 100%;
    min-height: ${theme.space['60']};
  `
);

const HeadingContainer = styled.div(
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

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;
  `
);

const Subtitle = styled(Typography)(
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
    width: 100%;
    flex-grow: 1;

    color: ${theme.colors.textTertiary};

    b {
      color: ${theme.colors.text};
    }
  `
);

const ClosingTypography = styled(Typography)(
  ({ theme }) => css`
    b {
      color: ${theme.colors.red};
    }
  `
);

type Status = 'proposals' | 'voting' | 'closed';

type BaseProps = {
  id: number;
  title: string;
  round: number;
  status: Status;
  children: React.ReactNode;
};

const StatusTag = ({ status }: { status: Status }) => {
  if (status === 'proposals') {
    return <Tag tone="green">Accepting submissions</Tag>;
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
    <StyledCard>
      <HeadingContainer>
        <HeadingTextContainer>
          <Title>{title}</Title>
          <Subtitle>Round {round}</Subtitle>
        </HeadingTextContainer>
        <StatusTag status={status} />
      </HeadingContainer>
      {children}
      <Button
        shadowless
        as="a"
        href={href}
        variant={status === 'closed' ? 'secondary' : 'primary'}
        onClick={handleClick as unknown as ClickHandler}
      >
        {status === 'voting' ? 'Vote' : 'View'}
      </Button>
    </StyledCard>
  );
};

const calcStatus = (round: Round): Status => {
  if (round.proposalEnd > new Date()) return 'proposals';
  if (round.votingEnd > new Date()) return 'voting';
  return 'closed';
};

export const RoundCard = (round: Round) => {
  const status = calcStatus(round);

  const baseProps = {
    id: round.id,
    round: round.round,
    status,
    title: round.title,
  };

  const isPropsOpen = status === 'proposals';
  const isWaitingForVoting = round.proposalEnd < new Date() && round.votingStart > new Date();
  const isVotingOpen = status === 'voting';

  if (isPropsOpen) {
    return (
      <BaseRoundCard {...baseProps}>
        <InfoContainer>
          {round.title.includes('Ecosystem') || round.title.includes('Public Goods') ? (
            round.title.includes('Ecosystem') ? (
              <ClosingTypography>Projects that specifically build on or improve the ENS Ecosystem.</ClosingTypography>
            ) : (
              <ClosingTypography>Projects that benefit the entire Ethereum or Web3 space.</ClosingTypography>
            )
          ) : (
            <>
              <Typography>
                <b>Now accepting submissions</b>
              </Typography>
              <ClosingTypography>
                Submissions close in{' '}
                <b style={{ display: 'block' }}>{getTimeDifferenceString(new Date(), round.proposalEnd)}</b>
              </ClosingTypography>
            </>
          )}
        </InfoContainer>
      </BaseRoundCard>
    );
  }

  if (isWaitingForVoting) {
    return (
      <BaseRoundCard {...baseProps}>
        <InfoContainer>
          <ClosingTypography>
            Voting opens in <b style={{ display: 'block' }}>{getTimeDifferenceString(new Date(), round.votingStart)}</b>
          </ClosingTypography>
        </InfoContainer>
      </BaseRoundCard>
    );
  }

  if (isVotingOpen) {
    return (
      <BaseRoundCard {...baseProps}>
        <InfoContainer>
          {round.title.includes('Ecosystem') || round.title.includes('Public Goods') ? (
            round.title.includes('Ecosystem') ? (
              <ClosingTypography>Projects that specifically build on or improve the ENS Ecosystem.</ClosingTypography>
            ) : (
              <ClosingTypography>Projects that benefit the entire Ethereum or Web3 space.</ClosingTypography>
            )
          ) : (
            <ClosingTypography>
              Voting closes in{' '}
              <b style={{ display: 'block' }}>{getTimeDifferenceString(new Date(), round.votingEnd)}</b>
            </ClosingTypography>
          )}
        </InfoContainer>
      </BaseRoundCard>
    );
  }

  if (!round.snapshot) {
    return (
      <BaseRoundCard {...baseProps}>
        <div style={{ flexGrow: 1 }} />
      </BaseRoundCard>
    );
  }

  const proposalCount = round.snapshot.choices.length;
  const voteCount = round.snapshot.scoresTotal;

  return (
    <BaseRoundCard {...baseProps}>
      <InfoContainer>
        <Typography>
          <b>{proposalCount}</b> proposals
        </Typography>
        <Typography>
          <b>{Intl.NumberFormat('en', { notation: 'compact' }).format(voteCount)}</b> voted tokens
        </Typography>
        {status === 'closed' && (
          <Typography>Ended {getTimeDifferenceString(round.votingEnd, new Date())} ago</Typography>
        )}
      </InfoContainer>
    </BaseRoundCard>
  );
};

export default RoundCard;
