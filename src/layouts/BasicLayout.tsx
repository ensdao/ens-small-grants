import { mq } from '@ensdomains/thorin';
import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import Header from '../components/Header';

const BodyContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['12']};
    `)}
  `
);

const MainContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    gap: ${theme.space['4']};

    width: 100%;
    max-width: ${theme.space['320']};

    ${mq.md.min(css`
      gap: ${theme.space['10']};
    `)}
  `
);

const BasicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <BodyContainer className="min-safe">
      <Header />
      <MainContent>{children}</MainContent>
    </BodyContainer>
  );
};

export default BasicLayout;
