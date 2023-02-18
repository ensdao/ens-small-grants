import { ThorinGlobalStyles } from '@ensdomains/thorin';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { WagmiConfig } from 'wagmi';

import App from './App';
import './index.css';
import { rainbowKitTheme, thorinTheme } from './theme';
import { chains, wagmiClient } from './walletConfig';

const ColoredRainbowKitProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  // const { colorMode } = { colorMode: 'light' };

  return (
    <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
      {children}
    </RainbowKitProvider>
  );
};

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <>
    <React.StrictMode>
      <WagmiConfig client={wagmiClient}>
        <ColoredRainbowKitProvider>
          <HelmetProvider>
            <BrowserRouter>
              <ThemeProvider theme={thorinTheme}>
                <ThorinGlobalStyles />
                <App />
              </ThemeProvider>
            </BrowserRouter>
          </HelmetProvider>
        </ColoredRainbowKitProvider>
      </WagmiConfig>
    </React.StrictMode>
  </>
);
