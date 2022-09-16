import { mq } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';

export const BannerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    width: 100%;

    padding: ${theme.space['8']};
    border-radius: ${theme.radii.extraLarge};

    background-color: ${theme.colors.foregroundTertiary};

    & > div:first-child {
      text-align: center;
      & > div:first-child {
        font-size: ${theme.fontSizes.extraLarge};
        font-weight: bold;
      }
      & > div:last-child {
        color: ${theme.colors.textSecondary};
        font-size: ${theme.fontSizes.large};
      }
    }

    ${mq.md.min(css`
      & > div:first-child {
        text-align: left;
      }
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    `)}
  `
);
