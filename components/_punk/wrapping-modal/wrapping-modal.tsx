import {
  useAllPendingTransactions,
  usePauseMonitoring,
  useSetPauseMonitoring,
} from "@/components/transactions-monitor/transactions-monitor.atoms";
import { usePunkByTokenId } from "@/features/nft.hooks";
import {
  usePreferImpersonatedAccount,
  useUserProxyWallet,
} from "@/features/user.hooks";
import { Button } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { isAddressEqual } from "viem";
import RegisterProxyModalContent from "./register-proxy-modal-content";
import WrappingModalFirstStepContent from "./wrapping-modal-first-step-content";
import WrappingModalSecondStepContent from "./wrapping-modal-second-step-content";
import { useOpenWrappingModal, useWrappingModal } from "./wrapping-modal.atoms";

const WrappingModal = ({ punkId }: { punkId: number }) => {
  const { isOpen } = useWrappingModal();
  const openWrappingModal = useOpenWrappingModal();

  const allPendingTransactions = useAllPendingTransactions();
  const isMonitoringPaused = usePauseMonitoring();
  const setPauseMonitoring = useSetPauseMonitoring();

  const { data: punk, isFetching: isFetchingPunk } = usePunkByTokenId(punkId);

  const { address } = usePreferImpersonatedAccount();

  const { data: userProxyWallet, isFetching: isFetchingProxyWallet } =
    useUserProxyWallet(address || "");

  const isFetching = useMemo(
    () => isFetchingPunk || isFetchingProxyWallet,
    [isFetchingPunk, isFetchingProxyWallet]
  );

  useEffect(() => {
    if (isOpen && !isMonitoringPaused) {
      setPauseMonitoring(true);
      return;
    }

    if (!isOpen && isMonitoringPaused) {
      setPauseMonitoring(false);
    }
  }, [isOpen, isMonitoringPaused, setPauseMonitoring]);

  const userCanWrap = useMemo(
    () =>
      (address &&
        punk &&
        punk.owner &&
        ((userProxyWallet && isAddressEqual(userProxyWallet, punk.owner)) ||
          isAddressEqual(address, punk.owner))) ||
      false,
    [address, userProxyWallet, punk]
  );

  const isPending = useMemo(
    () =>
      (punk &&
        punk.owner &&
        userProxyWallet &&
        isAddressEqual(userProxyWallet, punk.owner)) ||
      false,
    [userProxyWallet, punk]
  );

  return (
    <>
      {userCanWrap && (
        <Button
          colorScheme="primary"
          onClick={() => openWrappingModal({ punkId })}
          isLoading={!!allPendingTransactions || isFetching}
        >
          {isPending ? "Continue Wrapping" : "Wrap Punk"}
        </Button>
      )}
      {isOpen && <WrappingModalInner />}
    </>
  );
};

const WrappingModalInner = () => {
  const { punkId } = useWrappingModal();

  const { data: punk } = usePunkByTokenId(punkId);

  const { address } = usePreferImpersonatedAccount();

  const { data: userProxyWallet, isLoading: isLoadingProxyWallet } =
    useUserProxyWallet(address || "");

  const shouldShowDeployProxyWalletStep = useMemo(
    () => address && !isLoadingProxyWallet && !userProxyWallet,
    [address, userProxyWallet, isLoadingProxyWallet]
  );

  const shouldShowStep1 = useMemo(
    () =>
      address &&
      userProxyWallet &&
      punk &&
      punk.owner &&
      isAddressEqual(address, punk.owner),
    [address, userProxyWallet, punk]
  );

  const shouldShowStep2 = useMemo(
    () =>
      address &&
      userProxyWallet &&
      punk &&
      punk.owner &&
      isAddressEqual(userProxyWallet, punk.owner),
    [address, userProxyWallet, punk]
  );

  return (
    <>
      {shouldShowDeployProxyWalletStep && <RegisterProxyModalContent />}
      {shouldShowStep1 && <WrappingModalFirstStepContent />}
      {shouldShowStep2 && <WrappingModalSecondStepContent />}
    </>
  );
};

export default WrappingModal;
