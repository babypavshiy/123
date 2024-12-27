import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, goerli } from 'wagmi/chains';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains([mainnet, goerli], [publicProvider()]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectorsForWallets([{ groupName: 'Recommended', wallets: [] }]),
  provider,
});

export function AppWrapper({ children }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
