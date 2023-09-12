import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';
import { chain, configureChains, createClient } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const providers = ALCHEMY_ID ? [alchemyProvider({ apiKey: ALCHEMY_ID }), publicProvider()] : [publicProvider()];

export const { chains, provider } = configureChains([chain.mainnet], providers);

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
