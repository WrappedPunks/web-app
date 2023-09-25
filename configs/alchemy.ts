import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_ETHEREUM_API_KEY, NETWORK } from "./env";

export const ALCHEMY_NFT_API_BASE_URL =
  NETWORK === "mainnet"
    ? `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_ETHEREUM_API_KEY}/`
    : `https://eth-goerli.g.alchemy.com/nft/v2/${ALCHEMY_ETHEREUM_API_KEY}/`;

export const ALCHEMY_CORE_API_BASE_URL =
  NETWORK === "mainnet"
    ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETHEREUM_API_KEY}/`
    : `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_ETHEREUM_API_KEY}/`;

const settings = {
  apiKey: ALCHEMY_ETHEREUM_API_KEY,
  network: NETWORK === "mainnet" ? Network.ETH_MAINNET : Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

export default alchemy;
