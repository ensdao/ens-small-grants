import { Helper, mq, Typography } from '@ensdomains/thorin';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import styled, { css } from 'styled-components';

import { BackButtonWithSpacing } from '../../components/BackButton';
import { BannerContainer } from '../../components/BannerContainer';
import GrantRoundSection from '../../components/GrantRoundSection';
import OpenGraphElements from '../../components/OpenGraphElements';
import { formatFundingPerWinner, getTimeDifferenceString, serializeGrant, serializeRound } from '../../utils';
import { getRound } from '../api/round/[id]';
import { z } from 'zod';
import { Round } from '@/kysely/db';

const Container = styled.div(
  ({ scholarship }: { scholarship?: boolean }) => css`
    width: 100%;
    max-width: ${scholarship ? '65rem' : '100%'};
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

export default function Round({ staticRound }: { staticRound: Round }) {
  const router = useRouter();
  const { success } = router.query;

  const showHelper = success !== undefined || false;

  return (
    <>
      <OpenGraphElements title={`${staticRound.title || ''} | ENS Small Grants`} />

      <RoundContent round={staticRound} showHelper={showHelper} />
    </>
  );
}

const RoundContent = ({ round, showHelper }: { round: Round; showHelper: boolean }) => {
  const to = `/create?round=${round.id}`;
  const isActiveRound = new Date(round.proposalStart) < new Date() && new Date(round.votingEnd) > new Date();
  const isVotingRound = new Date(round.votingStart) < new Date() && new Date(round.votingEnd) > new Date();
  const isPropRound = new Date(round.proposalStart) < new Date() && new Date(round.proposalEnd) > new Date();

  let upperVoteMsg: React.ReactNode;
  let lowerVoteMsg: React.ReactNode;
  let noSnapshotWhenNeeded = false;

  if (isActiveRound && !isPropRound && !isVotingRound) {
    // Time between submissions closed and voting starts
    // upperVoteMsg = <p>Voting starts in {getTimeDifferenceString(new Date(), round.votingStart)}</p>;
    upperVoteMsg = <p>Voting starts soon</p>;
    lowerVoteMsg = <p>Submissions closed</p>;
  } else {
    const fundingPerWinnerStr = formatFundingPerWinner(round);

    upperVoteMsg = (<b>{fundingPerWinnerStr}</b>);

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
          Submissions close in {getTimeDifferenceString(new Date(), round.proposalEnd)}
        </span>
      );
    }
  }

  return (
    <>
      <Container scholarship={round.scholarship || false}>
        <BackButtonWithSpacing href="/" />

        {showHelper && (
          <Helper
            type="info"
            style={{
              marginTop: '1rem',
            }}
          >
            Proposal submission recieved!
          </Helper>
        )}

        <HeadingContainer>
          <Title>
            <b>{round.title.split('Round')[0]}</b> {!round.scholarship && `Round ${round.title.split('Round')[1]}`}
          </Title>
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

      <Container scholarship={round.scholarship || false}>
        {noSnapshotWhenNeeded ? (
          <BannerContainer>
            <Typography>Looks like something went wrong, try again later.</Typography>
          </BannerContainer>
        ) : (
          <GrantRoundSection
            round={round}
            createProposalHref={to}
          />
        )}
      </Container>

      <div style={{ flexGrow: 1 }} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, params } = context;
  const schema = z.object({ id: z.coerce.number()});
  const { id } = schema.parse(params);

  if (!schema.safeParse(params).success) {
    throw new Error('No id provided');
  }

  const { grants, snapshot, ...rest } = await getRound(id);
  const serializedRound = serializeRound(rest);
  const serializedGrants = grants.map((grant) => serializeGrant(grant))

  // Cache the server rendered page for 1 min then use stale-while-revalidate for 1 hour
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600');

  return {
    props: {
      staticRound: {
        ...serializedRound,
        grants: serializedGrants,
        snapshot: snapshot || null
      },
    },
  };
}
