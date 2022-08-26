import { Heading, Spinner } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';

import BackButton from '../components/BackButton';
import RoundCard from '../components/RoundCard';
import { useRounds } from '../hooks';

const RoundGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${theme.space['72']}, 1fr));
    grid-auto-rows: ${theme.space['64']};
    gap: ${theme.space['8']};
    width: 100%;
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
  const { rounds, isLoading } = useRounds();

  if (isLoading || !rounds) {
    return <Spinner />;
  }

  const title = <Title>All rounds</Title>;

  return (
    <>
      <BackButton to="/" title={title} />
      <RoundGrid>
        {rounds
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          .map(r => (
            <RoundCard key={r.id} {...r} />
          ))}
      </RoundGrid>
      <div style={{ flexGrow: 1 }} />
    </>
  );
};

export default Rounds;
