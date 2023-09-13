import { mq, Heading, Spinner } from '@ensdomains/thorin';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';

import { BackButtonWithSpacing } from '../../components/BackButton';
import { EmptyHouse } from '../../components/HouseCard';
import OpenGraphElements from '../../components/OpenGraphElements';
import RoundCard from '../../components/RoundCard';
import { useHouses, useRounds } from '../../hooks';

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

export default function Rounds() {
  const router = useRouter();
  const query = router.query;
  const slug = query.slug as string | undefined;

  const { house } = useHouses({ slug });
  const { rounds } = useRounds();

  const filteredRounds = slug ? rounds?.filter(round => round.houseId === house?.id) : rounds;

  return (
    <>
      <OpenGraphElements title={`All Rounds - ENS Small Grants`} />

      {(() => {
        if (!rounds || !filteredRounds || (slug && !house)) {
          return <Spinner />;
        }

        return (
          <>
            <BackButtonWithSpacing
              href={house ? `/${house.slug}` : '/'}
              title={<Title>{house ? house.title : 'All'} Rounds</Title>}
            />

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
      })()}
    </>
  );
}
