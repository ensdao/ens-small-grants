import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';
import { chain, configureChains, createClient } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    alchemyProvider({
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);

export const { connectors } = getDefaultWallets({
  appName: 'ENS Small Grants',
  chains,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  queryClient,
});
