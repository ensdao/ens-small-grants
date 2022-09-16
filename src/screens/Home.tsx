import { mq, Spinner, Typography } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';

import Anchor from '../components/Anchor';
import RoundCard from '../components/RoundCard';
import { useRounds } from '../hooks';
import type { Round as RoundType } from '../types';

const Heading = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.space['9']};
    font-weight: bold;
  `
);

const Subheading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.large};
  `
);

const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: ${theme.space['2']};
    max-width: ${theme.space['144']};
    text-align: center;

    margin-top: ${theme.space['8']};

    ${mq.md.min(css`
      margin-top: 0;
    `)}
  `
);

const RoundItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    flex-wrap: wrap;
    gap: ${theme.space['4']};

    ${mq.md.min(css`
      height: ${theme.space['64']};
    `)}
  `
);

const RoundItemsOuter = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `
);

const SectionHeading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['2']};

    ${mq.md.min(css`
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: ${theme.space['4']};
      gap: ${theme.space['4']};

      padding: 0;
    `)}

    width: 100%;
  `
);

const ActiveTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-weight: bold;
  `
);

const MobileHiddenAnchor = styled(Anchor)(
  () => css`
    display: none;
    ${mq.md.min(css`
      display: block;
    `)}
  `
);

const DesktopHiddenAnchor = styled(Anchor)(
  () => css`
    display: block;
    ${mq.md.min(css`
      display: none;
    `)}
  `
);

const isActiveRound = (round: RoundType) => round.votingEnd > new Date() && round.proposalStart < new Date();

function Home() {
  const { rounds, isLoading } = useRounds();

  if (isLoading || !rounds) {
    return <Spinner size="large" color="purple" />;
  }

  const activeRounds = rounds.filter(r => isActiveRound(r));
  return (
    <>
      <HeadingContainer>
        <Heading>Small Grants from ENS DAO</Heading>
        <Subheading>
          Small grants are bytesized grants that any $ENS holder can vote on, with the top proposals of each round
          getting funded. Rounds are in waves, so there may not always be an active round.{' '}
        </Subheading>
      </HeadingContainer>
      <RoundItemsOuter>
        <SectionHeading>
          <ActiveTypography>Showing all active rounds</ActiveTypography>
          <MobileHiddenAnchor to="/rounds">See all rounds</MobileHiddenAnchor>
        </SectionHeading>
        <RoundItems>
          {activeRounds.map(r => (
            <RoundCard key={r.id} {...r} />
          ))}
        </RoundItems>
        <SectionHeading>
          <DesktopHiddenAnchor to="/rounds">See all rounds</DesktopHiddenAnchor>
        </SectionHeading>
      </RoundItemsOuter>
    </>
  );
}

export default Home;
