import LightBulb from "@/components/icons/light-bulb";
import {
  useAddUnwrapTransactionToMonitor,
  useAllPendingTransactions,
  usePauseMonitoring,
  useRemoveUnwrapTransactionToMonitor,
  useSetPauseMonitoring,
} from "@/components/transactions-monitor/transactions-monitor.atoms";
import { CHAIN } from "@/configs/env";
import { WRAPPED_PUNK_ABI } from "@/contracts";
import { usePunkByTokenId } from "@/features/nft.hooks";
import { getCryptoPunkImage } from "@/features/nft.utls";
import { useIsUnwrappingTxConfirmed } from "@/features/tx-watcher.hooks";
import { usePreferImpersonatedAccount } from "@/features/user.hooks";
import { CONTRACT_ADDRESS } from "@/utils/constants";
import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { isAddressEqual } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import {
  useCloseUnwrappingModal,
  useOpenUnwrappingModal,
  useUnwrappingModal,
} from "./unwrapping-modal.atoms";

const UnwrappingModal = ({ punkId }: { punkId: number }) => {
  const { isOpen } = useUnwrappingModal();
  const openWrappingModal = useOpenUnwrappingModal();
  const { address } = usePreferImpersonatedAccount();

  const allPendingTransactions = useAllPendingTransactions();
  const isMonitoringPaused = usePauseMonitoring();
  const setPauseMonitoring = useSetPauseMonitoring();

  const { data: punk, isFetching: isFetchingPunk } = usePunkByTokenId(punkId);

  const isFetching = useMemo(() => isFetchingPunk, [isFetchingPunk]);

  const userCanUnwrap = useMemo(
    () => address && punk && punk.owner && isAddressEqual(address, punk.owner),
    [address, punk]
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

  return (
    <>
      {userCanUnwrap && (
        <Button
          colorScheme="primary"
          onClick={() => openWrappingModal({ punkId })}
          isLoading={!!allPendingTransactions || isFetching}
        >
          Unwrap Punk
        </Button>
      )}
      {isOpen && <WrappingModalInner />}
    </>
  );
};

const WrappingModalInner = () => {
  const qc = useQueryClient();
  const closeWrappingModal = useCloseUnwrappingModal();
  const { punkId } = useUnwrappingModal();

  const { connector } = usePreferImpersonatedAccount();

  const addUnwrapTransactionToMonitor = useAddUnwrapTransactionToMonitor();
  const removeTxn = useRemoveUnwrapTransactionToMonitor();

  const { config: burnWrappedPunkConfig } = usePrepareContractWrite({
    chainId: CHAIN.id,
    address: CONTRACT_ADDRESS.WRAPPED_PUNKS as `0x${string}`,
    abi: WRAPPED_PUNK_ABI,
    functionName: "burn",
    args: punkId !== null ? [BigInt(punkId)] : undefined,
  });
  const {
    data: burnWrappedPunkTxData,
    isSuccess: isBurningWrappedPunkTransactionSent,
    isError: isBurningWrappedPunkError,
    write: burnWrappedPunk,
  } = useContractWrite({
    ...burnWrappedPunkConfig,
    onSuccess: (data) => {
      addUnwrapTransactionToMonitor(data.hash);
    },
  });

  const { isError: isTransactionError } = useWaitForTransaction({
    hash: burnWrappedPunkTxData?.hash,
  });

  const { data: txConfirmation, refetch: refetchTxConfirmation } =
    useIsUnwrappingTxConfirmed(burnWrappedPunkTxData?.hash);

  const [isBurningWrappedPunk, setIsBurningWrappedPunk] = useState(false);

  useEffect(() => {
    (isBurningWrappedPunkError || isTransactionError) &&
      setIsBurningWrappedPunk(false);
  }, [isBurningWrappedPunkError, isTransactionError]);

  useEffect(() => {
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
  }, [qc, txConfirmation, refetchTxConfirmation]);

  useEffect(() => {
    txConfirmation &&
      txConfirmation.status === "confirmed" &&
      setIsBurningWrappedPunk(false);
  }, [txConfirmation]);

  const closeModal = useMemo(
    () => () => {
      if (!isBurningWrappedPunk) {
        if (txConfirmation && txConfirmation.status === "confirmed") {
          qc.invalidateQueries(["punk", punkId]);
          qc.invalidateQueries(["cryptoPunksForOwner"]);
          qc.invalidateQueries(["wrappedPunksForOwner"]);
          burnWrappedPunkTxData && removeTxn(burnWrappedPunkTxData.hash);
        }
        closeWrappingModal();
      }
    },
    [
      isBurningWrappedPunk,
      closeWrappingModal,
      txConfirmation,
      qc,
      punkId,
      burnWrappedPunkTxData,
      removeTxn,
    ]
  );

  return (
    <Modal isOpen onClose={() => closeModal()} isCentered size="lg">
      <ModalOverlay />
      <ModalContent px={5} py={16} borderRadius="2xl">
        {!isBurningWrappedPunk &&
          (!txConfirmation || txConfirmation.status !== "confirmed") && (
            <>
              <ModalHeader>
                <VStack gap={4} mx="auto">
                  <LightBulb w={10} h={10} color="primary.500" />
                  <Text
                    textAlign="center"
                    color="primary.500"
                    fontWeight={700}
                    fontSize="2xl"
                  >
                    De-list W#{punkId} before Unwrapping
                  </Text>
                </VStack>
              </ModalHeader>
              <ModalBody py={8}>
                <VStack gap={4} maxW="375px" mx="auto">
                  <Text textAlign="left">
                    Remember to de-list W#{punkId} from all the marketplaces
                    (Rarible, Opensea...), otherwise it might get sold
                    immediately when you Wrap it again.
                  </Text>
                  <Text textAlign="left">
                    Make sure that you are interacting with the right contract,
                    calling the right method with the right data.
                  </Text>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <VStack w="100%" gap={0} alignItems="center">
                  <Button
                    colorScheme="primary"
                    px={10}
                    onClick={() => {
                      if (punkId !== null) {
                        setIsBurningWrappedPunk(true);
                        burnWrappedPunk?.();
                      }
                    }}
                    isDisabled={connector?.name === "Impersonate"}
                  >
                    Unwrap Punk
                  </Button>
                  <Button
                    variant="text"
                    onClick={closeWrappingModal}
                    textDecoration="underline"
                    color="gray.500"
                    fontWeight={300}
                  >
                    Cancel
                  </Button>
                </VStack>
              </ModalFooter>
            </>
          )}
        {isBurningWrappedPunk && (
          <>
            <ModalHeader>
              <Text
                textAlign="center"
                color="primary.500"
                fontWeight={700}
                fontSize="2xl"
              >
                {isBurningWrappedPunkTransactionSent
                  ? "Waiting for transaction to complete"
                  : "Confirm transaction on Metamask"}
              </Text>
            </ModalHeader>
            <ModalBody py={8}>
              <VStack gap={4} alignItems="center">
                <Text>Please do not refresh or close this page</Text>
                <Spinner color="primary.500" />
              </VStack>
            </ModalBody>
          </>
        )}
        {!isBurningWrappedPunk &&
          txConfirmation &&
          txConfirmation.status === "confirmed" && (
            <>
              <ModalHeader>
                <Text
                  textAlign="center"
                  color="primary.500"
                  fontWeight={700}
                  fontSize="2xl"
                >
                  Punk #{punkId} Successfully Unwrapped
                </Text>
              </ModalHeader>
              <ModalBody py={8}>
                <VStack gap={4} maxW="280px" mx="auto">
                  <Box
                    borderRadius="sm"
                    overflow="hidden"
                    aspectRatio={1}
                    backgroundColor="cryptopunksBg"
                    w="120px"
                    h="120px"
                  >
                    <Image
                      alt="crypto-punk-image"
                      src={punkId !== null ? getCryptoPunkImage(punkId) : ""}
                    />
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <VStack w="100%" gap={0} alignItems="center">
                  <Button
                    colorScheme="primary"
                    px={10}
                    onClick={() => closeModal()}
                  >
                    OK
                  </Button>
                </VStack>
              </ModalFooter>
            </>
          )}
      </ModalContent>
    </Modal>
  );
};

export default UnwrappingModal;
