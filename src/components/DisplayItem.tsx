import { Typography } from '@ensdomains/thorin';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { Avatar } from '../components/Avatar';
import { shortenAddress } from '../utils';

const DisplayItemContainer = styled.div<{ $shrink?: boolean; $fade?: boolean }>(
  ({ theme, $shrink, $fade }) => css`
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: center;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid} rgba(${theme.shadesRaw.foreground}, 0.06);
    min-height: ${theme.space['14']};
    padding: ${theme.space['2']} ${theme.space['5']};
    width: ${theme.space.full};

    ${$shrink &&
    css`
      min-height: ${theme.space['12']};
      div {
        margin-top: 0;
        align-self: center;
      }
    `}
    ${$fade &&
    css`
      opacity: 0.5;
      background-color: ${theme.colors.backgroundTertiary};
    `}
  `
);

const DisplayItemLabel = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
    justify-self: flex-start;
  `
);

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    min-width: ${theme.space['7']};
    height: ${theme.space['7']};
  `
);

const ValueWithAvatarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
  `
);

const InnerValueWrapper = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    text-align: right;
  `
);

const ValueTypography = styled(Typography)(
  () => css`
    text-align: right;
  `
);

const AddressSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
    font-weight: ${theme.fontWeights.medium};
  `
);

const AddressValue = ({ value }: { value: string }) => {
  const { data: primary } = useEnsName({ address: value, chainId: 1 });
  const { data: avatar } = useEnsAvatar({ addressOrName: value, chainId: 1 });

  const AddressTypography = useMemo(
    () =>
      primary ? (
        <AddressSubtitle variant="label">{shortenAddress(value)}</AddressSubtitle>
      ) : (
        <ValueTypography weight="bold">{shortenAddress(value)}</ValueTypography>
      ),
    [primary, value]
  );

  return (
    <ValueWithAvatarContainer>
      <InnerValueWrapper>
        {primary && <ValueTypography weight="bold">{primary}</ValueTypography>}
        {AddressTypography}
      </InnerValueWrapper>
      <AvatarWrapper>
        <Avatar src={avatar || undefined} label={value} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  );
};

const DisplayItem = ({
  label,
  value,
  address,
  shrink,
  fade,
}: {
  label: string;
  value: string;
  address?: boolean;
  shrink?: boolean;
  fade?: boolean;
}) => {
  return (
    <DisplayItemContainer $fade={fade} $shrink={shrink} key={`${label}-${value}`}>
      <DisplayItemLabel>{label}</DisplayItemLabel>
      {address ? <AddressValue value={value} /> : <ValueTypography weight="bold">{value}</ValueTypography>}
    </DisplayItemContainer>
  );
};

export default DisplayItem;
