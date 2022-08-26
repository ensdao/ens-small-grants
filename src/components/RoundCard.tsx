import { Button, mq, Tag, Typography } from '@ensdomains/thorin';
import { useHref, useLinkClickHandler } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ClickHandler, Round } from '../types';
import { getTimeDifferenceString } from '../utils';
import { Card } from './atoms';

const StyledCard = styled(Card)(
  ({ theme }) => css`
    width: 100%;
    ${mq.md.min(css`
      width: ${theme.space['72']};
    `)}
  `
);

const HeadingContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
    justify-content: center;
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
  if (status === 'proposals') return null;
  if (status === 'voting') {
    return <Tag tone="red">Voting</Tag>;
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
        View
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

  if (status === 'proposals') {
    return (
      <BaseRoundCard {...baseProps}>
        <InfoContainer>
          <Typography>
            <b>Now accepting submissions</b>
          </Typography>
          <ClosingTypography>
            Submissions close in{' '}
            <b style={{ display: 'block' }}>{getTimeDifferenceString(new Date(), round.proposalEnd)}</b>
          </ClosingTypography>
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
