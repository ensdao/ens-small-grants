import { mq, Typography } from '@ensdomains/thorin';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Logo from '../assets/Logo.svg';
import ShortLogo from '../assets/ShortLogo.svg';

const HeaderContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `
);

const LogoAndText = styled(Link)(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `
);

const FullLogoIcon = styled(Logo)(
  ({ theme }) => css`
    width: ${theme.space['32']};
    display: none;
    ${mq.md.min(css`
      display: block;
    `)}
  `
);

const ShortLogoIcon = styled(ShortLogo)(
  ({ theme }) => css`
    width: ${theme.space['16']};
    ${mq.md.min(css`
      display: none;
    `)}
  `
);

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: bold;
    display: none;

    i {
      display: none;
      font-style: normal;
    }

    ${mq.sm.min(css`
      display: block;
    `)}

    ${mq.md.min(css`
      i {
        display: inline-block;
      }
      white-space: nowrap;
      font-size: 1.625rem;
      transform: translateY(0.0625rem);
      margin-bottom: ${theme.space['1']};
    `)}
  `
);

const NavButtons = styled.nav(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    white-space: nowrap;

    a {
      color: ${theme.colors.textTertiary};

      &:hover,
      &:active {
        color: ${theme.colors.accent};
      }
    }

    gap: ${theme.space['6']};

    ${mq.md.min(css`
      justify-content: center;
      gap: ${theme.space['8']};
    `)}
  `
);

const Header = () => {
  return (
    <HeaderContainer>
      <LogoAndText to="/">
        <FullLogoIcon />
        <ShortLogoIcon />
        <Title>
          <i>Small</i> Grants
        </Title>
      </LogoAndText>
      <NavButtons>
        <Link to="/faq">FAQ</Link>
        <ConnectButton chainStatus="none" showBalance={false} />
      </NavButtons>
    </HeaderContainer>
  );
};

export default Header;
