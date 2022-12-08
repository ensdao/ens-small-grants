import { Heading, Spinner } from '@ensdomains/thorin';

import Anchor from '../components/Anchor';
import { EmptyHouse } from '../components/HouseCard';
import RoundCard from '../components/RoundCard';
import {
  ActiveTypography,
  DesktopHiddenAnchor,
  HeadingContainer,
  MobileHiddenAnchor,
  RoundGrid,
  RoundItemsOuter,
  SectionHeading,
  Subheading,
} from '../components/atoms';
import { useRounds } from '../hooks';
import type { Round as RoundType } from '../types';

const isActiveRound = (round: RoundType) => round.votingEnd > new Date() && round.proposalStart < new Date();

const singleRoundCss = {
  gridTemplateColumns: '1fr',
  maxWidth: '37rem',
};

function Home() {
  const { rounds, isLoading: roundsAreLoading } = useRounds();

  if (roundsAreLoading || !rounds) {
    return <Spinner size="large" color="purple" />;
  }

  const activeRounds = rounds.filter(r => isActiveRound(r));

  return (
    <>
      <HeadingContainer>
        <Heading>ENS Small Grants</Heading>
        <Subheading>
          ENS Small Grants allow $ENS holders to vote on projects to receive funding, sponsored by the Public Goods and
          Ecosystem Working Groups.
        </Subheading>
      </HeadingContainer>
      <RoundItemsOuter>
        {activeRounds.length > 1 && (
          <SectionHeading className="desktop-only">
            <ActiveTypography>Showing all active rounds</ActiveTypography>
            <MobileHiddenAnchor to={`/rounds`}>See all rounds</MobileHiddenAnchor>
          </SectionHeading>
        )}

        {activeRounds.length === 0 && (
          <div
            style={{
              padding: '2rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <EmptyHouse>No active rounds</EmptyHouse>
            <Anchor to="/rounds">See all rounds</Anchor>
          </div>
        )}

        <RoundGrid style={activeRounds.length === 1 ? singleRoundCss : undefined}>
          {activeRounds.map(round => (
            <RoundCard key={round.id} {...round} />
          ))}
        </RoundGrid>

        <SectionHeading>
          {activeRounds.length === 1 && (
            <MobileHiddenAnchor
              to={`/rounds`}
              style={{
                margin: '0.5rem auto',
              }}
            >
              See all rounds
            </MobileHiddenAnchor>
          )}
          {activeRounds.length > 0 && <DesktopHiddenAnchor to="/rounds">See all rounds</DesktopHiddenAnchor>}
        </SectionHeading>
      </RoundItemsOuter>
    </>
  );
}

export default Home;
