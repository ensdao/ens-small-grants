import { Button, Typography } from '@ensdomains/thorin';
import { formatEther } from '@ethersproject/units';
import styled, { css } from 'styled-components';

import CheckIcon from '../assets/check_green.svg';
import VotingIcon from '../assets/voting.svg';
import { House, Round } from '../types';
import { getRoundStatus } from '../utils';
import { StyledCard, Subtitle, Title, HeadingContainer } from './RoundCard';

type HouseCardProps = {
  house: House;
  rounds: Round[];
};

const Rounds = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['3']};
    width: 100%;
  `
);

const PropRound = styled.a(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: ${theme.space['2']} ${theme.space['4']};
    border-radius: ${theme.radii.medium};
    background-color: ${theme.colors.backgroundSecondary};
    box-shadow: 1px 1px 4px -1px rgba(0, 0, 0, 0.15);
  `
);

const RoundName = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
  `
);

const AccentText = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.label};
    font-weight: ${theme.fontWeights.medium};
  `
);

const Icon = styled.div(
  ({ theme }) => css`
    width: ${theme.space['4']};
    height: ${theme.space['4']};

    svg {
      width: 100%;
      height: 100%;
    }
  `
);

export const EmptyHouse = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    opacity: 0.5;
    color: ${theme.colors.textPlaceholder};
    font-size: ${theme.fontSizes.headingThree};
    font-weight: ${theme.fontWeights.semiBold};
  `
);

export default function HouseCard({ house, rounds }: HouseCardProps) {
  return (
    <StyledCard>
      <HeadingContainer>
        <Title>{house.title}</Title>
      </HeadingContainer>

      {rounds.length > 0 ? (
        <Rounds>
          <Subtitle>Active Rounds</Subtitle>
          {rounds.map(round => (
            <PropRound href={`/rounds/${round.id}`} key={round.id}>
              <RoundName>
                <Icon>{getRoundStatus(round) === 'voting' ? <VotingIcon /> : <CheckIcon />}</Icon>
                <Typography weight="semiBold">
                  {round.title} <AccentText>Round {round.round}</AccentText>
                </Typography>
              </RoundName>
              <p>Ξ {Number(formatEther(round.allocationTokenAmount)).toFixed(0)}</p>
            </PropRound>
          ))}
        </Rounds>
      ) : (
        <EmptyHouse>No active rounds</EmptyHouse>
      )}
      <Button as="a" href={`/${house.slug}`}>
        View
      </Button>
    </StyledCard>
  );
}
