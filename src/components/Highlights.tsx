import { mq } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';

const HighlightsContainer = styled.div(
  ({ theme }) => css`
    gap: ${theme.space['3']};
    width: 100%;
    max-width: 36rem;
    display: grid;
    grid-template-columns: 2fr 2fr;

    ${mq.sm.min(css`
      gap: ${theme.space['4']};
      grid-template-columns: repeat(3, 1fr);
    `)}
  `
);

export function Highlights() {
  return (
    <HighlightsContainer>
      <Stat number="100+" label="ETH funded" />
      <Stat number="450+" label="Proposals" />
      <Stat number="450+" label="Voters" />
    </HighlightsContainer>
  );
}

const StatContainer = styled.div(
  ({ theme }) => css`
    background-color: #fff;
    padding: ${theme.space['4']};
    border-radius: ${theme.radii.extraLarge};
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: ${theme.space['2']};
    text-align: center;

    ${mq.sm.max(css`
      padding: ${theme.space['3']} ${theme.space['2']};

      &:last-child {
        grid-column: span 2;
      }
    `)}

    span {
      font-size: ${theme.fontSizes.headingTwo};
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.accent};

      ${mq.sm.max(css`
        font-size: ${theme.fontSizes.headingThree};
      `)}
    }

    label {
      font-size: ${theme.fontSizes.small};
    }
  `
);

function Stat({ number, label }: { number: number | string; label: string }) {
  return (
    <StatContainer>
      <span>{number}</span>
      <label>{label}</label>
    </StatContainer>
  );
}
