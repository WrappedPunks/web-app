import { configureChains, createConfig } from "wagmi";
import { Chain, goerli, mainnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ALCHEMY_ETHEREUM_API_KEY, NETWORK } from "./env";

interface Setting {
  defaultChains: Array<Chain>;
}

const DEFAULT_SETTINGS: Record<string, Setting> = {
  testnet: {
    defaultChains: [goerli],
  },
  mainnet: {
    defaultChains: [mainnet],
  },
};

const { defaultChains } = DEFAULT_SETTINGS[NETWORK];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  defaultChains,
  [alchemyProvider({ apiKey: ALCHEMY_ETHEREUM_API_KEY }), publicProvider()]
);

export const createWagmiConfig = () =>
  createConfig({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    publicClient,
    webSocketPublicClient,
  });
