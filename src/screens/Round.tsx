import { Helper, mq, Spinner, Typography } from '@ensdomains/thorin';
import ReactMarkdown from 'react-markdown';
import { useHref, useLinkClickHandler, useLocation, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import BackButton from '../components/BackButton';
import { BannerContainer } from '../components/BannerContainer';
import GrantRoundSection from '../components/GrantRoundSection';
import { useRounds } from '../hooks';
import { ClickHandler } from '../types';
import { formatFundingPerWinner, getTimeDifferenceString } from '../utils';

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    margin-top: ${theme.space['4']};

    ${mq.md.min(css`
      margin-top: 0;
    `)}
  `
);

const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${theme.space['4']};
    width: 100%;
    margin-top: ${theme.space['4']};

    ${mq.md.min(css`
      gap: ${theme.space['8']};
      flex-direction: row;
      height: max-content;
    `)}
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    color: ${theme.colors.textTertiary};
    flex-grow: 1;

    b {
      color: ${theme.colors.text};
      font-weight: bold;
    }

    ${mq.md.min(css`
      font-size: ${theme.space['9']};
    `)}
  `
);

const VoteDetailsContainer = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    gap: ${theme.space['4']};
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    ${mq.md.min(css`
      gap: 0;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 0;
      width: max-content;
    `)}
  `
);

const VotesTypography = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.textTertiary};

    b {
      color: ${theme.colors.indigo};
    }

    ${mq.md.min(css`
      font-size: ${theme.fontSizes.large};
    `)}
  `
);

const VoteTimeTypography = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.red};
    font-weight: bold;
    text-align: right;

    ${mq.md.min(css`
      font-size: ${theme.fontSizes.extraLarge};
      br {
        display: none;
      }
    `)}
  `
);

const RoundDescription = styled(Typography)(
  ({ theme }) => css`
    grid-area: content;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 80ch;
    color: ${theme.colors.textSecondary};

    gap: ${theme.space['4']};
    margin-top: ${theme.space['8']};

    a {
      color: ${theme.colors.indigo};
    }

    ${mq.md.max(css`
      margin-bottom: ${theme.space['4']};
    `)}
  `
);

export const Round = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const showHelper = (((state as Record<string, boolean>) || {}).submission as boolean) || false;

  const { round, isLoading } = useRounds(id!);

  const to = `/rounds/${id}/proposals/create`;
  const href = useHref(to);
  const onClick = useLinkClickHandler(to);

  if (isLoading || !round) {
    return <Spinner size="large" />;
  }

  const isActiveRound = round.proposalStart < new Date() && round.votingEnd > new Date();
  const isVotingRound = round.votingStart < new Date() && round.votingEnd > new Date();
  const isPropRound = round.proposalStart < new Date() && round.proposalEnd > new Date();

  let upperVoteMsg: React.ReactNode;
  let lowerVoteMsg: React.ReactNode;
  let noSnapshotWhenNeeded = false;

  if (isActiveRound && !isPropRound && !isVotingRound) {
    // Time between submissions closed and voting starts
    upperVoteMsg = <p>Voting starts in {getTimeDifferenceString(new Date(), round.votingStart)}</p>;
    lowerVoteMsg = <p>Submissions closed</p>;
  } else {
    const fundingPerWinnerStr = formatFundingPerWinner(round);

    upperVoteMsg = (
      <>
        <b>{fundingPerWinnerStr}</b> x <b>{round.maxWinnerCount} projects</b>
      </>
    );

    if (!round.snapshot && (!isActiveRound || isVotingRound)) {
      noSnapshotWhenNeeded = true;
      lowerVoteMsg = <>Close time unknown</>;
    } else if (!isActiveRound) {
      lowerVoteMsg = (
        <span title={round.votingEnd.toLocaleString()}>
          Voting closed {getTimeDifferenceString(round.votingEnd, new Date())} ago
        </span>
      );
    } else {
      lowerVoteMsg = isVotingRound ? (
        <span title={round.votingEnd.toLocaleString()}>
          Voting closes in <br />
          {getTimeDifferenceString(new Date(), round.votingEnd)}
        </span>
      ) : (
        <span title={round.proposalEnd.toLocaleString()}>
          Submissions close in <br />
          {getTimeDifferenceString(new Date(), round.proposalEnd)}
        </span>
      );
    }
  }

  const titleContent = (
    <Title>
      <b>{round.title}</b> Round {round.round}
    </Title>
  );

  return (
    <>
      <Container>
        <BackButton to="/" />
        {showHelper && <Helper type="info">Proposal submission recieved!</Helper>}

        <HeadingContainer>
          {titleContent}
          <VoteDetailsContainer>
            <VotesTypography>{upperVoteMsg}</VotesTypography>
            <VoteTimeTypography>{lowerVoteMsg}</VoteTimeTypography>
          </VoteDetailsContainer>
        </HeadingContainer>
        {round.description && (
          <RoundDescription>
            <ReactMarkdown
              components={{
                p: ({ children }) => <Typography as="p">{children}</Typography>,
                a: ({ children, href: mdHref }) => (
                  <a href={mdHref} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {round.description}
            </ReactMarkdown>
          </RoundDescription>
        )}
      </Container>
      {noSnapshotWhenNeeded ? (
        <BannerContainer>
          <Typography>Looks like something went wrong, try again later.</Typography>
        </BannerContainer>
      ) : (
        <GrantRoundSection
          randomiseGrants={isActiveRound && isVotingRound}
          isPropsOpen={isPropRound}
          createProposalHref={href}
          createProposalClick={onClick as unknown as ClickHandler | (() => void)}
          {...round}
        />
      )}
      <div style={{ flexGrow: 1 }} />
    </>
  );
};
