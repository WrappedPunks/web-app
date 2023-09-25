import {
  useAddWrapStepTwoTransactionToMonitor,
  useRemoveWrapStepTwoTransactionToMonitor,
} from "@/components/transactions-monitor/transactions-monitor.atoms";
import { CHAIN } from "@/configs/env";
import { WRAPPED_PUNK_ABI } from "@/contracts";
import { useIsWrappingTxStep2Confirmed } from "@/features/tx-watcher.hooks";
import { usePreferImpersonatedAccount } from "@/features/user.hooks";
import { CONTRACT_ADDRESS } from "@/utils/constants";
import { getWrappedPunkImageUrl } from "@/utils/wrappedpunks";
import {
  Box,
  Button,
  HStack,
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
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import {
  useCloseWrappingModal,
  useWrappingModal,
} from "./wrapping-modal.atoms";

const WrappingModalSecondStepContent = () => {
  const qc = useQueryClient();
  const closeWrappingModal = useCloseWrappingModal();
  const { punkId } = useWrappingModal();

  const { connector } = usePreferImpersonatedAccount();

  const addWrapStepTwoTransactionToMonitor =
    useAddWrapStepTwoTransactionToMonitor();
  const removeTxn = useRemoveWrapStepTwoTransactionToMonitor();

  const { config: mintWrappedPunkConfig } = usePrepareContractWrite({
    chainId: CHAIN.id,
    address: CONTRACT_ADDRESS.WRAPPED_PUNKS as `0x${string}`,
    abi: WRAPPED_PUNK_ABI,
    functionName: "mint",
    args: punkId !== null ? [BigInt(punkId)] : undefined,
  });
  const {
    data: mintWrappedPunkTxData,
    isSuccess: isMintingWrappedPunkTransactionSent,
    isError: isMintingWrappedPunkError,
    write: mintWrappedPunk,
  } = useContractWrite({
    ...mintWrappedPunkConfig,
    onSuccess: (data) => {
      addWrapStepTwoTransactionToMonitor(data.hash);
    },
  });

  const { isError: isTransactionError } = useWaitForTransaction({
    hash: mintWrappedPunkTxData?.hash,
  });

  const { data: txConfirmation, refetch: refetchTxConfirmation } =
    useIsWrappingTxStep2Confirmed(mintWrappedPunkTxData?.hash);

  const [isMintingWrappedPunk, setIsMintingWrappedPunk] = useState(false);

  useEffect(() => {
    (isMintingWrappedPunkError || isTransactionError) &&
      setIsMintingWrappedPunk(false);
  }, [isMintingWrappedPunkError, isTransactionError]);

  useEffect(() => {
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
  }, [qc, txConfirmation, refetchTxConfirmation]);

  useEffect(() => {
    txConfirmation &&
      txConfirmation.status === "confirmed" &&
      setIsMintingWrappedPunk(false);
  }, [txConfirmation]);

  const closeModal = useMemo(
    () => () => {
      if (!isMintingWrappedPunk) {
        if (txConfirmation && txConfirmation.status === "confirmed") {
          qc.invalidateQueries(["punk", punkId]);
          qc.invalidateQueries(["cryptoPunksForOwner"]);
          qc.invalidateQueries(["wrappedPunksForOwner"]);
          mintWrappedPunkTxData && removeTxn(mintWrappedPunkTxData.hash);
        }
        closeWrappingModal();
      }
    },
    [
      isMintingWrappedPunk,
      closeWrappingModal,
      txConfirmation,
      qc,
      punkId,
      mintWrappedPunkTxData,
      removeTxn,
    ]
  );

  return (
    <Modal isOpen onClose={() => closeModal()} isCentered size="lg">
      <ModalOverlay />
      <ModalContent px={4} py={12} borderRadius="2xl">
        {!isMintingWrappedPunk &&
          (!txConfirmation || txConfirmation.status !== "confirmed") && (
            <>
              <ModalHeader>
                <Text
                  textAlign="center"
                  color="primary.500"
                  fontWeight={700}
                  fontSize="2xl"
                >
                  Wrap Punk #{punkId}
                </Text>
                <HStack gap={0} fontSize="md" justifyContent="center" mt={4}>
                  <Box
                    w={6}
                    h={6}
                    backgroundColor="primary.500"
                    color="white"
                    borderRadius="full"
                  >
                    <Text textAlign="center" fontWeight={700}>
                      1
                    </Text>
                  </Box>
                  <Box h={1} w="100px" backgroundColor="primary.500" />
                  <Box
                    w={6}
                    h={6}
                    backgroundColor="primary.500"
                    color="white"
                    borderRadius="full"
                  >
                    <Text textAlign="center" fontWeight={700}>
                      2
                    </Text>
                  </Box>
                </HStack>
              </ModalHeader>
              <ModalBody py={8}>
                <VStack gap={4} maxW="200px" mx="auto">
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
                      src={
                        punkId !== null ? getWrappedPunkImageUrl(punkId) : ""
                      }
                    />
                  </Box>
                  <VStack spacing={0}>
                    <Text textAlign="center">First Transaction Executed.</Text>
                    <Text textAlign="center">One more step to go.</Text>
                  </VStack>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <VStack w="100%" gap={0} alignItems="center">
                  <Button
                    colorScheme="primary"
                    px={10}
                    onClick={() => {
                      if (punkId !== null) {
                        setIsMintingWrappedPunk(true);
                        mintWrappedPunk?.();
                      }
                    }}
                    isDisabled={connector?.name === "Impersonate"}
                  >
                    Finish Wrapping
                  </Button>
                  <Button
                    variant="text"
                    onClick={closeWrappingModal}
                    textDecoration="underline"
                    color="gray.500"
                    fontWeight="normal"
                  >
                    Cancel
                  </Button>
                </VStack>
              </ModalFooter>
            </>
          )}
        {isMintingWrappedPunk && (
          <>
            <ModalHeader>
              <Text
                textAlign="center"
                color="primary.500"
                fontWeight={700}
                fontSize="2xl"
              >
                {isMintingWrappedPunkTransactionSent
                  ? "Waiting for transaction to complete"
                  : "Confirm transaction on Metamask"}
              </Text>
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4} alignItems="center">
                <Text>Please do not refresh or close this page</Text>
                <Spinner color="primary.500" />
              </VStack>
            </ModalBody>
          </>
        )}
        {!isMintingWrappedPunk &&
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
                  Punk #{punkId} Successfully Wrapped
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
                      src={
                        punkId !== null ? getWrappedPunkImageUrl(punkId) : ""
                      }
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

export default WrappingModalSecondStepContent;
