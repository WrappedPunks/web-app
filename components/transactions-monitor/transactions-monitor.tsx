import {
  useIsUnwrappingTxConfirmed,
  useIsWrappingTxStep1Confirmed,
  useIsWrappingTxStep2Confirmed,
} from "@/features/tx-watcher.hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { memo, useEffect } from "react";
import { useWaitForTransaction } from "wagmi";
import {
  deployProxyWalletTransactionsMonitorAtom,
  unwrapTransactionsMonitorAtom,
  usePauseMonitoring,
  useRemoveDeployProxyWalletTransactionToMonitor,
  useRemoveUnwrapTransactionToMonitor,
  useRemoveWrapStepOneTransactionToMonitor,
  useRemoveWrapStepTwoTransactionToMonitor,
  wrapStepOneTransactionsMonitorAtom,
  wrapStepTwoTransactionsMonitorAtom,
} from "./transactions-monitor.atoms";

const DeployProxyWalletTransactionMonitor = ({
  hash,
}: {
  hash: `0x${string}`;
}) => {
  const removeTxn = useRemoveDeployProxyWalletTransactionToMonitor();
  const isMonitoringPaused = usePauseMonitoring();
  const qc = useQueryClient();

  const { isSuccess, isError } = useWaitForTransaction({
    hash: hash,
  });

  useEffect(() => {
    if (isMonitoringPaused) return;

    if (isSuccess) {
      qc.invalidateQueries(["userProxyWallet"]);
      removeTxn(hash);
    }

    if (isError) {
      removeTxn(hash);
    }
  }, [isMonitoringPaused, isSuccess, isError, hash, qc, removeTxn]);

  return null;
};

const WrapStepOneTransactionMonitor = ({ hash }: { hash: `0x${string}` }) => {
  const removeTxn = useRemoveWrapStepOneTransactionToMonitor();
  const isMonitoringPaused = usePauseMonitoring();
  const qc = useQueryClient();

  const { isError } = useWaitForTransaction({
    hash: hash,
  });

  const { data: txConfirmation, refetch: refetchTxConfirmation } =
    useIsWrappingTxStep1Confirmed(hash);

  useEffect(() => {
    if (isMonitoringPaused) return;

    if (
      txConfirmation?.status &&
      txConfirmation.status !== "confirmed" &&
      !txConfirmation.error
    ) {
      // remove and invalidate queries after 0.5 s
      setTimeout(() => {
        qc.removeQueries(["wrappingTxStep1"]);
        refetchTxConfirmation();
      }, 500);
    }
  }, [qc, txConfirmation, refetchTxConfirmation, isMonitoringPaused]);

  useEffect(() => {
    if (isMonitoringPaused) return;

    if (txConfirmation && txConfirmation.status === "confirmed") {
      qc.invalidateQueries(["punk"]);
      qc.invalidateQueries(["cryptoPunksForOwner"]);
      removeTxn(hash);
    }

    if (isError) {
      removeTxn(hash);
    }
  }, [isMonitoringPaused, txConfirmation, isError, hash, qc, removeTxn]);

  return null;
};

const WrapStepTwoTransactionMonitor = ({ hash }: { hash: `0x${string}` }) => {
  const removeTxn = useRemoveWrapStepTwoTransactionToMonitor();
  const isMonitoringPaused = usePauseMonitoring();
  const qc = useQueryClient();

  const { isError } = useWaitForTransaction({
    hash: hash,
  });

  const { data: txConfirmation, refetch: refetchTxConfirmation } =
    useIsWrappingTxStep2Confirmed(hash);

  useEffect(() => {
    if (isMonitoringPaused) return;

    if (
      txConfirmation?.status &&
      txConfirmation.status !== "confirmed" &&
      !txConfirmation.error
    ) {
      // remove and invalidate queries after 0.5 s
      setTimeout(() => {
        qc.removeQueries(["wrappingTxStep2"]);
        refetchTxConfirmation();
      }, 500);
    }
  }, [qc, txConfirmation, refetchTxConfirmation, isMonitoringPaused]);

  useEffect(() => {
    if (isMonitoringPaused) return;

    if (txConfirmation && txConfirmation.status === "confirmed") {
      qc.invalidateQueries(["punk"]);
      qc.invalidateQueries(["cryptoPunksForOwner"]);
      qc.invalidateQueries(["wrappedPunksForOwner"]);
      removeTxn(hash);
    }

    if (isError) {
      removeTxn(hash);
    }
  }, [isMonitoringPaused, txConfirmation, isError, hash, qc, removeTxn]);

  return null;
};

const UnwrapTransactionMonitor = ({ hash }: { hash: `0x${string}` }) => {
  const removeTxn = useRemoveUnwrapTransactionToMonitor();
  const isMonitoringPaused = usePauseMonitoring();
  const qc = useQueryClient();

  const { isError } = useWaitForTransaction({
    hash: hash,
  });

  const { data: txConfirmation, refetch: refetchTxConfirmation } =
    useIsUnwrappingTxConfirmed(hash);

  useEffect(() => {
    if (isMonitoringPaused) return;

    if (
      txConfirmation?.status &&
      txConfirmation.status !== "confirmed" &&
      !txConfirmation.error
    ) {
      // remove and invalidate queries after 0.5 s
      setTimeout(() => {
        qc.removeQueries(["unwrappingTx"]);
        refetchTxConfirmation();
      }, 500);
    }
  }, [qc, txConfirmation, refetchTxConfirmation, isMonitoringPaused]);

  useEffect(() => {
    if (isMonitoringPaused) return;

    if (txConfirmation && txConfirmation.status === "confirmed") {
      qc.invalidateQueries(["punk"]);
      qc.invalidateQueries(["cryptoPunksForOwner"]);
      qc.invalidateQueries(["wrappedPunksForOwner"]);
      removeTxn(hash);
    }

    if (isError) {
      removeTxn(hash);
    }
  }, [isMonitoringPaused, txConfirmation, isError, hash, qc, removeTxn]);

  return null;
};

function TransactionsMonitor() {
  const [deployProxyWalletTransactions] = useAtom(
    deployProxyWalletTransactionsMonitorAtom
  );
  const [wrapStepOneTransactions] = useAtom(wrapStepOneTransactionsMonitorAtom);
  const [wrapStepTwoTransactions] = useAtom(wrapStepTwoTransactionsMonitorAtom);
  const [unwrapTransactions] = useAtom(unwrapTransactionsMonitorAtom);

  return (
    <>
      {deployProxyWalletTransactions.map((hash) => (
        <DeployProxyWalletTransactionMonitor key={hash} hash={hash} />
      ))}
      {wrapStepOneTransactions.map((hash) => (
        <WrapStepOneTransactionMonitor key={hash} hash={hash} />
      ))}
      {wrapStepTwoTransactions.map((hash) => (
        <WrapStepTwoTransactionMonitor key={hash} hash={hash} />
      ))}
      {unwrapTransactions.map((hash) => (
        <UnwrapTransactionMonitor key={hash} hash={hash} />
      ))}
    </>
  );
}

export default memo(TransactionsMonitor);
