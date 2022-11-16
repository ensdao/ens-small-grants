import { Heading, Spinner } from '@ensdomains/thorin';
import { useParams } from 'react-router-dom';

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
import { useHouses, useRounds } from '../hooks';
import { getRoundStatus } from '../utils';

export default function House() {
  const { slug } = useParams<{ slug: string }>();
  const { house } = useHouses({ slug });
  const { rounds } = useRounds();

  if (!house || !rounds) {
    return <Spinner size="large" color="purple" />;
  }

  const activeRoundStates = new Set(['proposals', 'pending-voting', 'voting']);
  const activeHouseRounds = rounds.filter(
    round => round.houseId === house.id && activeRoundStates.has(getRoundStatus(round))
  );

  return (
    <>
      <HeadingContainer>
        <Heading>{house.title}</Heading>
        <Subheading>{house.description}</Subheading>
      </HeadingContainer>
      <RoundItemsOuter>
        <SectionHeading className="desktop-only">
          <ActiveTypography>Showing all active rounds</ActiveTypography>
          <MobileHiddenAnchor to={`/${slug}/rounds`}>See all rounds</MobileHiddenAnchor>
        </SectionHeading>

        {activeHouseRounds.length === 0 && (
          <div
            style={{
              padding: '2rem 0',
            }}
          >
            <EmptyHouse>No active rounds</EmptyHouse>
          </div>
        )}

        <RoundGrid>
          {activeHouseRounds.map(round => (
            <RoundCard key={round.id} {...round} />
          ))}
        </RoundGrid>
        <SectionHeading>
          <DesktopHiddenAnchor to="/rounds">See all rounds</DesktopHiddenAnchor>
        </SectionHeading>
      </RoundItemsOuter>
    </>
  );
}
