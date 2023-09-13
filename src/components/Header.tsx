import { mq, Typography } from '@ensdomains/thorin';
import Link from 'next/link';
import styled, { css } from 'styled-components';

import Logo from '../assets/Logo';
import ShortLogo from '../assets/ShortLogo';
import { ConnectButton } from './ConnectButton';

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

const FullLogoIconWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['32']};
    display: none;
    ${mq.md.min(css`
      display: block;
    `)}
  `
);

const ShortLogoIconWrapper = styled.div(
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
      <LogoAndText href="/">
        <FullLogoIconWrapper>
          <Logo />
        </FullLogoIconWrapper>
        <ShortLogoIconWrapper>
          <ShortLogo />
        </ShortLogoIconWrapper>
        <Title>
          <i>Small</i> Grants
        </Title>
      </LogoAndText>
      <NavButtons>
        <Link href="/faq">FAQ</Link>
        <ConnectButton />
      </NavButtons>
    </HeaderContainer>
  );
};

export default Header;
