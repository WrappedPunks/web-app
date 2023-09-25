import { TPunkType } from "@/types";
import { NULL_ADDRESS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import {
  getCryptoPunks,
  getCryptoPunksForOwner,
  getPunkByTokenId,
  getPunkTransactionHistory,
  getWrappedPunks,
  getWrappedPunksForOwner,
} from "./nft.services";

export const useWrappedPunks = () => {
  return useQuery({
    queryKey: ["wrappedPunks"],
    queryFn: ({ signal }) => getWrappedPunks(signal),
    select: (data) => data?.filter((punk) => punk.owner !== NULL_ADDRESS),
    refetchOnMount: false,
    cacheTime: Infinity,
  });
};

export const useCryptoPunks = () => {
  return useQuery({
    queryKey: ["cryptoPunks"],
    queryFn: ({ signal }) => getCryptoPunks(signal),
    refetchOnMount: false,
    cacheTime: Infinity,
  });
};

// export const useWrappedPunkByTokenId = (tokenId: number) => {
//   return useQuery({
//     queryKey: ["wrappedPunk", tokenId],
//     queryFn: () => getWrappedPunkByTokenId(tokenId),
//     refetchOnMount: false,
//   });
// };

// export const useCryptoPunkByTokenId = (
//   tokenId: number,
//   config?: {
//     enabled?: boolean;
//   }
// ) => {
//   return useQuery({
//     queryKey: ["cryptoPunk", tokenId],
//     queryFn: () => getCryptoPunkByTokenId(tokenId),
//     refetchOnMount: false,
//     enabled: config?.enabled,
//   });
// };

export const usePunkByTokenId = (tokenId: number | null) => {
  return useQuery({
    queryKey: ["punk", tokenId],
    queryFn: () => getPunkByTokenId(tokenId),
    enabled: tokenId !== null,
  });
};

export const useWrappedPunksForOwner = (owner: `0x${string}`) => {
  return useQuery({
    queryKey: ["wrappedPunksForOwner", owner],
    queryFn: () => getWrappedPunksForOwner(owner),
    enabled: isAddress(owner),
  });
};

export const useCryptoPunksForOwner = (owner: `0x${string}`) => {
  return useQuery({
    queryKey: ["cryptoPunksForOwner", owner],
    queryFn: () => getCryptoPunksForOwner(owner),
    enabled: isAddress(owner),
  });
};

export const usePunkTransactionHistory = (params: {
  tokenId: number;
  pageKey?: string;
  punkType?: TPunkType;
}) => {
  return useQuery({
    queryKey: ["punkTransactions", params],
    queryFn: () => getPunkTransactionHistory(params),
  });
};
