import { client } from '@/supabase';
import { Heading, mq, Spinner, Typography } from '@ensdomains/thorin';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled, { css } from 'styled-components';

import BackButton, { BackButtonWithSpacing } from '../../components/BackButton';
import { GrantsFilterOptions } from '../../components/GrantRoundSection';
import OpenGraphElements from '../../components/OpenGraphElements';
import Profile from '../../components/Profile';
import VoteSection from '../../components/VoteSection';
import { SnapshotProposalResponse, useGrantIds, useGrants, useRounds, useStorage } from '../../hooks';
import type { GrantInDatabase, Grant, Round, RoundInDatabase } from '../../types';
import { getTimeDifferenceString } from '../../utils';

const Title = styled(Heading)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    ${mq.md.min(css`
      font-size: ${theme.fontSizes.headingOne};
    `)}
  `
);

const Description = styled(Heading)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-weight: lighter;
    font-size: ${theme.fontSizes.extraLarge};
    line-height: ${theme.lineHeights.normal};
    ${mq.md.min(css`
      font-size: ${theme.fontSizes.headingThree};
    `)}
  `
);

const TitleContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['2']};
  `
);

const ContentGrid = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: grid;
    gap: ${theme.space['4']};

    & > div:first-child {
      display: grid;
      gap: ${theme.space['6']};

      ${mq.lg.min(css`
        gap: ${theme.space['8']};
      `)}
    }

    ${mq.lg.min(css`
      grid-template-columns: 4fr minmax(${theme.space['72']}, 1fr);
      gap: ${theme.space['16']};
    `)}
  `
);

const OnlyMobile = styled.div`
  ${mq.lg.min(css`
    display: none;
  `)}
`;

const OnlyDesktop = styled.div`
  ${mq.lg.max(css`
    display: none;
  `)}
`;

const MarkdownWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    width: 100%;

    gap: ${theme.space['4']};

    p {
      font-weight: ${theme.fontWeights.medium};
      line-height: ${theme.lineHeights['1.625']};
    }

    h4 {
      font-size: ${theme.fontSizes.large};
      margin-top: ${theme.space['2']};
    }

    h3 {
      font-size: ${theme.fontSizes.extraLarge};
      margin-top: ${theme.space['2']};
    }

    h2 {
      font-size: ${theme.fontSizes.headingThree};
      margin-top: ${theme.space['4']};
    }

    h1 {
      font-size: ${theme.fontSizes.headingTwo};
    }

    ul,
    ol {
      list-style: inside;
      margin-inline-start: 1.5rem;
      line-height: ${theme.lineHeights['1.625']};

      ${mq.md.min(css`
        list-style: disc;
      `)}
    }

    ol {
      list-style: decimal;
    }

    a {
      color: ${theme.colors.indigo};
    }

    img {
      max-width: 100%;
    }
  `
);

const ProposalNavigator = styled.div(
  () => css`
    display: flex;
    width: 100%;
    justify-content: space-between;
  `
);

const ProfileWrapper = styled(Link)(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: fit-content;

    min-width: ${theme.space['52']};
    padding: ${theme.space['2']};
    border-radius: ${theme.radii.large};

    background-color: ${theme.colors.background};
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  `
);

export default function Proposal({
  staticGrant,
  staticRound,
}: {
  staticGrant: GrantInDatabase;
  staticRound: RoundInDatabase;
}) {
  // const { round, isLoading: roundLoading } = useRounds(roundId.toString());
  // const { grant, isLoading } = useGrants(round, id.toString());
  // const { grants: grantIds, isLoading: grandIdsLoading } = useGrantIds(Number(roundId));

  // const { getItem } = useStorage();
  // const _grantsFilter = getItem('grants-filter', 'session');
  // const grantsFilter = _grantsFilter as GrantsFilterOptions | undefined;

  // const _storedGrants = getItem(`round-${roundId}-grants`, 'session');
  // const storedGrants: Grant[] | undefined = _storedGrants && JSON.parse(_storedGrants);

  // let currentIndex: number | undefined;
  // let previousGrantId: number | undefined;
  // let nextGrantId: number | undefined;

  // If grants are stored in session storage, use that to calculate the previous and next grant
  // if (grantsFilter === 'random' && storedGrants) {
  //   currentIndex = storedGrants.findIndex(storedGrant => storedGrant.id === grant?.id);
  //   previousGrantId = storedGrants[currentIndex - 1]?.id;
  //   nextGrantId = storedGrants[currentIndex + 1]?.id;
  // } else {
  //   currentIndex = grantIds?.findIndex(grantId => grantId.id === grant?.id);
  //   previousGrantId = grantIds?.[currentIndex! - 1]?.id;
  //   nextGrantId = grantIds?.[currentIndex! + 1]?.id;
  // }

  return (
    <>
      <OpenGraphElements title={`${staticGrant.title}`} description={staticGrant.description} />

      <BackButtonWithSpacing href={`/rounds/${staticGrant.round_id}`} />
      <ContentGrid>
        <div>
          <TitleContainer>
            <Title>{staticGrant.title}</Title>
            {staticGrant.description && <Description>{staticGrant.description}</Description>}
          </TitleContainer>

          {!staticRound.scholarship && (
            <ProfileWrapper href={`/profile/${staticGrant.proposer}`}>
              <Profile
                address={staticGrant.proposer}
                subtitle={`${getTimeDifferenceString(new Date(staticGrant.created_at), new Date())} ago`}
              />
            </ProfileWrapper>
          )}

          {/* apply onlyMobile styles */}
          {/* <OnlyMobile>
            <VoteSection round={round} proposal={grant} />
          </OnlyMobile> */}

          <MarkdownWrapper>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <Typography as="h1">{children}</Typography>,
                h2: ({ children }) => <Typography as="h2">{children}</Typography>,
                h3: ({ children }) => <Typography as="h3">{children}</Typography>,
                h4: ({ children }) => <Typography as="h4">{children}</Typography>,
                h5: ({ children }) => <Typography as="h5">{children}</Typography>,
                h6: ({ children }) => <Typography as="h6">{children}</Typography>,
                p: ({ children }) => <Typography as="p">{children}</Typography>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {staticGrant.full_text}
            </ReactMarkdown>
          </MarkdownWrapper>

          {/* {!grandIdsLoading && (
            <ProposalNavigator>
              {previousGrantId && (
                <BackButton href={`/rounds/${round.id}/proposals/${previousGrantId}`} text="Previous" />
              )}
              {nextGrantId && <BackButton href={`/rounds/${round.id}/proposals/${nextGrantId}`} text="Next" reverse />}
            </ProposalNavigator>
          )} */}
        </div>

        {/* <OnlyDesktop>
          <VoteSection round={round} proposal={grant} />
        </OnlyDesktop> */}
      </ContentGrid>
      <div style={{ flexGrow: 1 }} />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, params } = context;
  const { id } = params as { id: string | undefined };

  if (!id) {
    throw new Error('No id provided');
  }

  const grant = await client
    .from('grants')
    .select('id, round_id, proposer, title, description, full_text, created_at')
    .eq('id', id);

  if (grant.error) {
    throw grant.error;
  }

  const grantBody = grant.body[0] as GrantInDatabase;
  const round = await client.from('rounds').select('*').eq('id', grantBody.round_id);

  if (round.error) {
    throw round.error;
  }

  const roundBody = round.body[0] as RoundInDatabase;

  // Cache the server rendered page for 1 min then use stale-while-revalidate for 10 min
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');

  return {
    props: {
      staticGrant: grantBody,
      staticRound: roundBody,
    },
  };
}
