import { Avatar, Typography } from '@ensdomains/thorin';
import styled, { css } from 'styled-components';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { shortenAddress } from '../utils';

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
  `
);

const ProfileContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['3']};
  `
);

const NameTypography = styled(Typography)(
  () => css`
    font-weight: bold;
  `
);

const TimeTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.small};
  `
);

function Profile({ address, subtitle }: { address: string; subtitle: string }) {
  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  });
  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  });

  return (
    <ProfileContainer className="profile">
      <AvatarWrapper>
        <Avatar src={ensAvatar || undefined} label={ensName || shortenAddress(address)} />
      </AvatarWrapper>
      <div>
        <NameTypography>{ensName || shortenAddress(address)}</NameTypography>
        <TimeTypography>{subtitle}</TimeTypography>
      </div>
    </ProfileContainer>
  );
}

// Same thing as the above `Profile` but the name and avatar passed in as props vs loaded dynamically
export function StaticProfile({
  address,
  name,
  subtitle,
}: {
  address: string;
  subtitle: string;
  name: string | undefined;
}) {
  const { data: avatar } = useEnsAvatar({
    addressOrName: address,
    chainId: 1,
  });

  return (
    <ProfileContainer className="profile">
      <AvatarWrapper>
        <Avatar src={avatar || undefined} label={name || shortenAddress(address)} />
      </AvatarWrapper>
      <div>
        <NameTypography>{name || shortenAddress(address)}</NameTypography>
        <TimeTypography>{subtitle}</TimeTypography>
      </div>
    </ProfileContainer>
  );
}

export default Profile;
