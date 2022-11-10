import { mq, Spinner, Typography } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';

import HouseCard from '../components/HouseCard';
import { useRounds, useHouses } from '../hooks';
import type { Round as RoundType } from '../types';

export const Heading = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.space['9']};
    font-weight: bold;
  `
);

export const Subheading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.large};
  `
);

export const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: ${theme.space['2']};
    max-width: ${theme.space['144']};
    text-align: center;

    margin-top: ${theme.space['10']};

    ${mq.md.min(css`
      margin-top: 0;
    `)}
  `
);

export const RoundGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: ${theme.space['8']};
    width: 100%;

    ${mq.md.min(css`
      grid-template-columns: repeat(2, 1fr);
    `)}
  `
);

export const RoundItemsOuter = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    width: 100%;
    max-width: ${theme.space['256']};
    margin-top: ${theme.space['2']};
  `
);

const isActiveRound = (round: RoundType) => round.votingEnd > new Date() && round.proposalStart < new Date();

function Home() {
  const { rounds, isLoading: roundsAreLoading } = useRounds();
  const { houses, isLoading: housesAreLoading } = useHouses({});

  // eslint-disable-next-line no-console
  console.log(houses);

  if (roundsAreLoading || !rounds || housesAreLoading || !houses) {
    return <Spinner size="large" color="purple" />;
  }

  const activeRounds = rounds.filter(r => isActiveRound(r));

  return (
    <>
      <HeadingContainer>
        <Heading>Small Grants from ENS DAO</Heading>
        <Subheading>
          ENS DAO Small Grants allow $ENS holders to vote on projects to receive funding, sponsored by the Public Goods
          and Ecosystem working group.
        </Subheading>
      </HeadingContainer>
      <RoundItemsOuter>
        <RoundGrid>
          {houses.map(house => (
            <HouseCard key={house.id} house={house} rounds={activeRounds.filter(round => round.houseId === house.id)} />
          ))}
        </RoundGrid>
      </RoundItemsOuter>
    </>
  );
}

export default Home;
