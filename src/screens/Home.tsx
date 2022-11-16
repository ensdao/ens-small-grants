import { Heading, Spinner } from '@ensdomains/thorin';

import HouseCard from '../components/HouseCard';
import { HeadingContainer, RoundGrid, RoundItemsOuter, Subheading } from '../components/atoms';
import { useRounds, useHouses } from '../hooks';
import type { Round as RoundType } from '../types';

const isActiveRound = (round: RoundType) => round.votingEnd > new Date() && round.proposalStart < new Date();

function Home() {
  const { rounds, isLoading: roundsAreLoading } = useRounds();
  const { houses, isLoading: housesAreLoading } = useHouses({});

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
