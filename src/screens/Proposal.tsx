import { Heading, mq, Spinner, Typography } from '@ensdomains/thorin';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import styled, { css } from 'styled-components';

import BackButton from '../components/BackButton';
import Profile from '../components/Profile';
import VoteSection from '../components/VoteSection';
import { useGrantIds, useGrants, useRounds } from '../hooks';
import { getTimeDifferenceString } from '../utils';

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
    grid-area: title;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['2']};
  `
);

const ContentGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: 'title' 'profile' 'votes' 'content';
    justify-items: start;
    gap: ${theme.space['4']};

    .profile {
      grid-area: profile;
    }

    ${mq.lg.min(css`
      max-width: 100%;
      grid-template-columns: 4fr minmax(${theme.space['72']}, 1fr);
      row-gap: ${theme.space['8']};
      column-gap: ${theme.space['24']};
      grid-auto-rows: min-content;
      grid-template-areas:
        'title votes'
        'profile votes'
        'content votes'
        '. votes'
        '. votes';
    `)}
  `
);

const MarkdownWrapper = styled.div(
  ({ theme }) => css`
    grid-area: content;
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
    }

    h4 {
      font-size: ${theme.fontSizes.large};
    }

    h3 {
      font-size: ${theme.fontSizes.extraLarge};
    }

    h2 {
      font-size: ${theme.fontSizes.headingThree};
    }

    h1 {
      font-size: ${theme.fontSizes.headingTwo};
    }

    ul {
      list-style: inside;
      ${mq.md.min(css`
        list-style: disc;
      `)}
      line-height: ${theme.lineHeights['1.5']};
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

    min-width: ${theme.space['52']};
    padding: ${theme.space['2']};
    border-radius: ${theme.radii.large};

    background-color: ${theme.colors.background};
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  `
);

function Proposal() {
  const { id, roundId } = useParams<{ id: string; roundId: string }>();
  const { round, isLoading: roundLoading } = useRounds(roundId!);
  const { grant, isLoading } = useGrants(round, id!);

  const { grants: grantIds, isLoading: grandIdsLoading } = useGrantIds(Number(roundId));
  // Find the grant id that is one before and one after the current grant.id
  const currentIndex = grantIds?.findIndex(grantId => grantId.id === grant?.id);
  const previousGrantId = grantIds?.[currentIndex! - 1]?.id;
  const nextGrantId = grantIds?.[currentIndex! + 1]?.id;

  if (isLoading || roundLoading || !grant || !round) {
    return <Spinner size="large" />;
  }

  return (
    <>
      <BackButton to={`/rounds/${roundId}`} />
      <ContentGrid>
        <TitleContainer>
          <Title>{grant.title}</Title>
          <Description>{grant.description}</Description>
        </TitleContainer>
        <ProfileWrapper to={`/profile/${grant.proposer}`}>
          <Profile address={grant.proposer} subtitle={`${getTimeDifferenceString(grant.createdAt, new Date())} ago`} />
        </ProfileWrapper>
        <VoteSection round={round} proposal={grant} />
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
            {grant.fullText}
          </ReactMarkdown>
        </MarkdownWrapper>
        {!grandIdsLoading && (
          <ProposalNavigator>
            {previousGrantId && <BackButton to={`/rounds/${round.id}/proposals/${previousGrantId}`} text="Previous" />}
            {nextGrantId && <BackButton to={`/rounds/${round.id}/proposals/${nextGrantId}`} text="Next" reverse />}
          </ProposalNavigator>
        )}
      </ContentGrid>
      <div style={{ flexGrow: 1 }} />
    </>
  );
}

export default Proposal;
