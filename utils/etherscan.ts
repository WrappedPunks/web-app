import { NETWORK } from "@/configs/env";
import { goerli, mainnet } from "wagmi/chains";

export const getEtherscanUrlByTxHash = (hash: string) => {
  const etherscanUrl =
    NETWORK === "testnet"
      ? goerli.blockExplorers.etherscan.url
      : mainnet.blockExplorers.etherscan.url;
  return `${etherscanUrl}/tx/${hash}`;
};

export const getEtherscanUrlByAddress = (address: string) => {
  const etherscanUrl =
    NETWORK === "testnet"
      ? goerli.blockExplorers.etherscan.url
      : mainnet.blockExplorers.etherscan.url;
  return `${etherscanUrl}/address/${address}`;
};
