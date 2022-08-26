import { mq, Typography } from '@ensdomains/thorin';
import styled, { css, DefaultTheme } from 'styled-components';

export const cardStyles = ({ theme }: { theme: DefaultTheme }) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: ${theme.space['4']};
  gap: ${theme.space['3']};

  background-color: ${theme.colors.background};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  border-radius: ${theme.radii.extraLarge};
`;

export const Card = styled.div(cardStyles);

export const TextWithHighlight = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    b {
      color: ${theme.colors.text};
    }
  `
);

export const InnerModal = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    padding: 0 ${theme.space['5']};
    gap: ${theme.space['4']};
    max-height: 60vh;
    overflow-y: auto;
    ${mq.sm.min(css`
      min-width: ${theme.space['128']};
    `)}
  `
);

export const DisplayItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    width: ${theme.space.full};
    gap: ${theme.space['2']};
  `
);
