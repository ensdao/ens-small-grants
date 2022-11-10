import { mq, Spinner, Typography } from '@ensdomains/thorin';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Anchor from '../components/Anchor';
import { EmptyHouse } from '../components/HouseCard';
import RoundCard from '../components/RoundCard';
import { useHouses, useRounds } from '../hooks';
import { getRoundStatus } from '../utils';
import { Heading, HeadingContainer, RoundGrid, RoundItemsOuter, Subheading } from './Home';

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
      margin-bottom: ${theme.space['2']};
      gap: ${theme.space['4']};

      padding: 0;
    `)}

    width: 100%;

    &.desktop-only {
      ${mq.md.max(css`
        display: none;
      `)}
    }
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
