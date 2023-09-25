import { TEnvironment, TNetworkType } from "@/types";
import { goerli, mainnet } from "wagmi/chains";

const networkKey = "ntwrk";

export const setOverriddenNetwork = (network?: TNetworkType) => {
  if (typeof window === "undefined") return;
  if (!network) {
    localStorage.removeItem(networkKey);
    return;
  }
  localStorage.setItem(networkKey, network);
};

const getNetwork = (): TNetworkType => {
  const defaultValue =
    (process.env.NEXT_PUBLIC_NETWORK as TNetworkType) ?? "mainnet";
  if (typeof window === "undefined") return defaultValue;
  const network = localStorage.getItem(networkKey);
  if (network === "mainnet" || network === "testnet") {
    return network;
  }
  localStorage.removeItem(networkKey);
  return defaultValue;
};

export const NETWORK = getNetwork();

export const ALCHEMY_ETHEREUM_API_KEY =
  process.env.NEXT_PUBLIC_ALCHEMY_ETHEREUM_API_KEY ?? "";

export const CONTRACT_ADDRESS_CRYPTO_PUNKS =
  (NETWORK === "testnet"
    ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_CRYPTO_PUNKS_GOERLI
    : process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_CRYPTO_PUNKS_MAINNET) ?? "";

export const CONTRACT_ADDRESS_WRAPPED_PUNKS =
  (NETWORK === "testnet"
    ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_WRAPPED_PUNKS_GOERLI
    : process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_WRAPPED_PUNKS_MAINNET) ?? "";

export const WRAPPED_PUNKS_IMAGE_HOST =
  NETWORK === "testnet"
    ? "https://images-dev.wrappedpunks.com"
    : "https://images.wrappedpunks.com";

export const S3_HOST = process.env.NEXT_PUBLIC_S3_HOST ?? "";

export const API_HOST =
  NETWORK === "testnet"
    ? "https://api-dev.wrappedpunks.com"
    : "https://api.wrappedpunks.com";

export const CHAIN = NETWORK === "mainnet" ? mainnet : goerli;

export const ENV: TEnvironment =
  (process.env.NEXT_PUBLIC_ENV as TEnvironment) || "production";

export const IS_CONNECTION_DISABLED: boolean =
  process.env.NEXT_PUBLIC_IS_CONNECTION_DISABLED === "true" ? true : false;
