import { mq, Typography } from '@ensdomains/thorin';
import styled, { css, DefaultTheme } from 'styled-components';

import Anchor from './Anchor';

export const cardStyles = ({ theme, hasPadding }: { theme: DefaultTheme; hasPadding?: boolean }) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: ${hasPadding ? theme.space['4'] : 0};
  gap: ${theme.space['3']};

  overflow: hidden;
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

export const SectionHeading = styled.div(
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

export const ActiveTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-weight: bold;
  `
);

export const MobileHiddenAnchor = styled(Anchor)(
  () => css`
    display: none;
    ${mq.md.min(css`
      display: block;
    `)}
  `
);

export const DesktopHiddenAnchor = styled(Anchor)(
  () => css`
    display: block;
    ${mq.md.min(css`
      display: none;
    `)}
  `
);

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
    max-width: 37rem;
    text-align: center;

    margin-top: ${theme.space['10']};

    ${mq.md.min(css`
      margin-top: ${theme.space['6']};
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
