import { Helper, mq, Spinner, Typography } from '@ensdomains/thorin';
import ReactMarkdown from 'react-markdown';
import { useHref, useLinkClickHandler, useLocation, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import BackButton from '../components/BackButton';
import { BannerContainer } from '../components/BannerContainer';
import GrantRoundSection from '../components/GrantRoundSection';
import { useRounds } from '../hooks';
import { ClickHandler } from '../types';
import { formatEthPerWinner, getTimeDifferenceString } from '../utils';

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
    align-items: flex-end;
    justify-content: space-between;

    width: 100%;

    ${mq.md.min(css`
      gap: ${theme.space['4']};
      flex-direction: row;
      height: max-content;
    `)}
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    color: ${theme.colors.textTertiary};
    text-align: right;
    flex-grow: 1;
    width: 100%;

    b {
      color: ${theme.colors.text};
      font-weight: bold;
      display: block;
    }

    ${mq.md.min(css`
      font-size: ${theme.space['9']};
      text-align: left;
      b {
        display: inline-block;
      }
    `)}
  `
);

const Subtitle = styled(Typography)(
  ({ theme }) => css`
    text-align: center;
    font-size: ${theme.fontSizes.extraLarge};
    color: ${theme.colors.textTertiary};
    width: 100%;

    b {
      color: ${theme.colors.indigo};
      font-weight: bold;
    }

    ${mq.md.min(css`
      width: auto;
      text-align: left;
    `)}
  `
);

const VoteDetailsContainer = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;

    margin-top: ${theme.space['6']};

    ${mq.md.min(css`
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      margin-top: 0;
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
      color: ${theme.colors.text};
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
  } else if (!round.snapshot && (!isActiveRound || isVotingRound)) {
    noSnapshotWhenNeeded = true;
    upperVoteMsg = (
      <>
        <b>0</b> total votes
      </>
    );
    lowerVoteMsg = <>Close time unknown</>;
  } else if (!isActiveRound) {
    upperVoteMsg = (
      <>
        <b>{Intl.NumberFormat('en', { notation: 'compact' }).format(round.snapshot!.scoresTotal!)}</b> total votes
      </>
    );
    lowerVoteMsg = (
      <>
        Voting closed <br />
        {getTimeDifferenceString(round.votingEnd, new Date())} ago
      </>
    );
  } else {
    if (isVotingRound) {
      upperVoteMsg = (
        <>
          <b>{Intl.NumberFormat('en', { notation: 'compact' }).format(round.snapshot!.scoresTotal!)}</b> votes so far
        </>
      );
      lowerVoteMsg = (
        <>
          Voting closes in <br />
          {getTimeDifferenceString(new Date(), round.votingEnd)}
        </>
      );
    } else {
      upperVoteMsg = 'Accepting submissions';
      lowerVoteMsg = (
        <>
          Submissions close in <br />
          {getTimeDifferenceString(new Date(), round.proposalEnd)}
        </>
      );
    }
  }

  const titleContent = (
    <Title>
      <b>{round.title}</b> Round {round.round}
    </Title>
  );

  const ethPerWinnerStr = formatEthPerWinner(round);

  return (
    <>
      <BackButton to="/" title={titleContent} />
      {showHelper && <Helper type="info">Proposal submission recieved!</Helper>}
      <Container>
        <HeadingContainer>
          <Subtitle>
            The <b>Top {round.maxWinnerCount}</b> voted proposals of this round get <b>{ethPerWinnerStr} ETH</b> each
          </Subtitle>
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
