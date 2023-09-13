import { Button, Profile, mq } from '@ensdomains/thorin';
import { ConnectButton as ConnectButtonBase } from '@rainbow-me/rainbowkit';
import styled, { css } from 'styled-components';
import { useDisconnect } from 'wagmi';

const StyledButton = styled(Button)`
  width: fit-content;

  ${mq.xs.min(css`
    min-width: 10rem;
  `)}
`;

export function ConnectButton() {
  const { disconnect } = useDisconnect();

  return (
    <ConnectButtonBase.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <StyledButton shape="rounded" size="small" onClick={openConnectModal}>
                    Connect
                  </StyledButton>
                );
              }

              if (chain.unsupported) {
                return (
                  <StyledButton shape="rounded" size="small" variant="primary" tone="red" onClick={openChainModal}>
                    Wrong network
                  </StyledButton>
                );
              }

              return (
                <Profile
                  address={account.address}
                  ensName={account.ensName || undefined}
                  avatar={account.ensAvatar || undefined}
                  onClick={openAccountModal}
                  dropdownItems={[
                    {
                      label: 'Copy Address',
                      color: 'text',
                      onClick: () => copyToClipBoard(account.address),
                    },
                    {
                      label: 'Disconnect',
                      color: 'red',
                      onClick: () => disconnect(),
                    },
                  ]}
                />
              );
            })()}
          </div>
        );
      }}
    </ConnectButtonBase.Custom>
  );
}

const copyToClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
