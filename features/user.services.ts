import alchemy from "@/configs/alchemy";
import { WRAPPED_PUNK_ABI } from "@/contracts";
import { CONTRACT_ADDRESS } from "@/utils/constants";
import { Address, encodeFunctionData } from "viem";

export const getUserProxyWallet = (address: string) => {
  const tx = {
    to: CONTRACT_ADDRESS.WRAPPED_PUNKS,
    data: encodeFunctionData({
      abi: WRAPPED_PUNK_ABI,
      functionName: "proxyInfo",
      args: [address as Address],
    }),
  };
  return alchemy.core.call(tx) as Promise<`0x${string}`>;
};
