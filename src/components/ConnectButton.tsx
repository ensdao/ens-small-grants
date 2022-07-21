import { Box, Button, Avatar } from '@chakra-ui/react';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

export type ConnectButtonProps = {
  showBalance: boolean;
};

export function ConnectButton(_: ConnectButtonProps) {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        return (
          <Box>
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button onClick={openConnectModal} variant="connectWallet">
                    Connect Wallet
                  </Button>
                );
              }

              return (
                <Button
                  leftIcon={<Avatar width="24px" height="24px" borderRadius="99999999px" src={account.ensAvatar} />}
                  onClick={openAccountModal}
                  variant="accountButton"
                >
                  {account.displayName}
                </Button>
              );
            })()}
          </Box>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
