import BasicLayout from '@/layouts/BasicLayout';
import { ThorinGlobalStyles } from '@ensdomains/thorin';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { WagmiConfig } from 'wagmi';

import '../index.css';
import { thorinTheme } from '../theme';
import { chains, wagmiConfig } from '../walletConfig';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ThemeProvider theme={thorinTheme}>
        <ThorinGlobalStyles />
        <RainbowKitProvider chains={chains} modalSize="compact">
          <BasicLayout>
            <Component {...pageProps} />
          </BasicLayout>
        </RainbowKitProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}
