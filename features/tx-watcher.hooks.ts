import { useQuery } from "@tanstack/react-query";
import { getIsTxConfirmed } from "./tx-watcher.services";

export const useIsWrappingTxStep1Confirmed = (txHash?: string) => {
  return useQuery({
    queryKey: ["wrappingTxStep1", txHash],
    queryFn: ({ signal }) => getIsTxConfirmed(txHash, signal),
    refetchOnMount: false,
    cacheTime: Infinity,
    enabled: !!txHash,
  });
};

export const useIsWrappingTxStep2Confirmed = (txHash?: string) => {
  return useQuery({
    queryKey: ["wrappingTxStep2", txHash],
    queryFn: ({ signal }) => getIsTxConfirmed(txHash, signal),
    refetchOnMount: false,
    cacheTime: Infinity,
    enabled: !!txHash,
  });
};

export const useIsUnwrappingTxConfirmed = (txHash?: string) => {
  return useQuery({
    queryKey: ["unwrappingTx", txHash],
    queryFn: ({ signal }) => getIsTxConfirmed(txHash, signal),
    refetchOnMount: false,
    cacheTime: Infinity,
    enabled: !!txHash,
  });
};
