import { mq, Heading, Spinner } from '@ensdomains/thorin';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { BackButtonWithSpacing } from '../components/BackButton';
import { EmptyHouse } from '../components/HouseCard';
import OpenGraphElements from '../components/OpenGraphElements';
import RoundCard from '../components/RoundCard';
import { useHouses, useRounds } from '../hooks';

const RoundGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.space['8']};
    width: 100%;

    ${mq.md.min(css`
      grid-template-columns: repeat(auto-fill, minmax(${theme.space['96']}, 1fr));
    `)}
  `
);

const Title = styled(Heading)(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    width: 100%;

    text-align: left;
  `
);

const Rounds = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { house } = useHouses({ slug });
  const { rounds } = useRounds();

  if (!rounds || (slug && !house)) {
    return <Spinner />;
  }

  const filteredRounds = slug ? rounds.filter(round => round.houseId === house?.id) : rounds;

  const title = <Title>{house ? house.title : 'All'} Rounds</Title>;

  return (
    <>
      <OpenGraphElements title={`All Rounds - ENS Small Grants`} />

      <BackButtonWithSpacing to={house ? `/${house.slug}` : '/'} title={title} />

      {filteredRounds.length === 0 && (
        <div
          style={{
            padding: '2rem 0',
          }}
        >
          <EmptyHouse>No rounds</EmptyHouse>
        </div>
      )}

      <RoundGrid>
        {filteredRounds.map(r => (
          <RoundCard key={r.id} {...r} />
        ))}
      </RoundGrid>
      <div style={{ flexGrow: 1 }} />
    </>
  );
};

export default Rounds;
