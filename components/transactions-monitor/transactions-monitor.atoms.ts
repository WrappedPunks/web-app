import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useMemo } from "react";

export const deployProxyWalletTransactionsMonitorAtom = atomWithStorage<
  `0x${string}`[]
>(`transactions.monitor.deployProxyWallet`, []);

export const wrapStepOneTransactionsMonitorAtom = atomWithStorage<
  `0x${string}`[]
>(`transactions.monitor.wrapStepOne`, []);

export const wrapStepTwoTransactionsMonitorAtom = atomWithStorage<
  `0x${string}`[]
>(`transactions.monitor.wrapStepTwo`, []);

export const unwrapTransactionsMonitorAtom = atomWithStorage<`0x${string}`[]>(
  `transactions.monitor.unwrap`,
  []
);

export function useMonitoringDeployProxyWalletTransactions() {
  const transactionsMonitor = useAtomValue(
    deployProxyWalletTransactionsMonitorAtom
  );
  return transactionsMonitor;
}

export function useAddDeployProxyWalletTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(
    deployProxyWalletTransactionsMonitorAtom
  );

  const addTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) => [...current, hash]);
    },
    [setTransactionsMonitor]
  );

  return addTransactionToMonitor;
}

export function useRemoveDeployProxyWalletTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(
    deployProxyWalletTransactionsMonitorAtom
  );

  const removeTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) =>
        current.filter((item) => item !== hash)
      );
    },
    [setTransactionsMonitor]
  );

  return removeTransactionToMonitor;
}

export function useMonitoringWrapStepOneTransactions() {
  const transactionsMonitor = useAtomValue(wrapStepOneTransactionsMonitorAtom);
  return transactionsMonitor;
}

export function useAddWrapStepOneTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(wrapStepOneTransactionsMonitorAtom);

  const addTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) => [...current, hash]);
    },
    [setTransactionsMonitor]
  );

  return addTransactionToMonitor;
}

export function useRemoveWrapStepOneTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(wrapStepOneTransactionsMonitorAtom);

  const removeTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) =>
        current.filter((item) => item !== hash)
      );
    },
    [setTransactionsMonitor]
  );

  return removeTransactionToMonitor;
}

export function useMonitoringWrapStepTwoTransactions() {
  const transactionsMonitor = useAtomValue(wrapStepTwoTransactionsMonitorAtom);
  return transactionsMonitor;
}

export function useAddWrapStepTwoTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(wrapStepTwoTransactionsMonitorAtom);

  const addTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) => [...current, hash]);
    },
    [setTransactionsMonitor]
  );

  return addTransactionToMonitor;
}

export function useRemoveWrapStepTwoTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(wrapStepTwoTransactionsMonitorAtom);

  const removeTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) =>
        current.filter((item) => item !== hash)
      );
    },
    [setTransactionsMonitor]
  );

  return removeTransactionToMonitor;
}

export function useMonitoringUnwrapTransactions() {
  const transactionsMonitor = useAtomValue(unwrapTransactionsMonitorAtom);
  return transactionsMonitor;
}

export function useAddUnwrapTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(unwrapTransactionsMonitorAtom);

  const addTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) => [...current, hash]);
    },
    [setTransactionsMonitor]
  );

  return addTransactionToMonitor;
}

export function useRemoveUnwrapTransactionToMonitor() {
  const setTransactionsMonitor = useSetAtom(unwrapTransactionsMonitorAtom);

  const removeTransactionToMonitor = useCallback(
    (hash: `0x${string}`) => {
      setTransactionsMonitor((current) =>
        current.filter((item) => item !== hash)
      );
    },
    [setTransactionsMonitor]
  );

  return removeTransactionToMonitor;
}

export function useAllPendingTransactions() {
  const deployProxyWalletTransactionsMonitor =
    useMonitoringDeployProxyWalletTransactions();
  const wrapStepOneTransactionsMonitor = useMonitoringWrapStepOneTransactions();
  const wrapStepTwoTransactionsMonitor = useMonitoringWrapStepTwoTransactions();
  const unwrapTransactionsMonitor = useMonitoringUnwrapTransactions();

  const allPendingTransactions = useMemo(
    () => [
      ...deployProxyWalletTransactionsMonitor,
      ...wrapStepOneTransactionsMonitor,
      ...wrapStepTwoTransactionsMonitor,
      ...unwrapTransactionsMonitor,
    ],
    [
      deployProxyWalletTransactionsMonitor,
      wrapStepOneTransactionsMonitor,
      wrapStepTwoTransactionsMonitor,
      unwrapTransactionsMonitor,
    ]
  );

  return allPendingTransactions.length > 0 ? allPendingTransactions : null;
}

export const pauseMonitoringAtom = atom<boolean>(false);

export function usePauseMonitoring() {
  const pauseMonitoring = useAtomValue(pauseMonitoringAtom);

  return pauseMonitoring;
}

export function useSetPauseMonitoring() {
  const setPauseMonitoring = useSetAtom(pauseMonitoringAtom);

  return setPauseMonitoring;
}
