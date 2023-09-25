import {
  useAddWrapStepOneTransactionToMonitor,
  useRemoveWrapStepOneTransactionToMonitor,
} from "@/components/transactions-monitor/transactions-monitor.atoms";
import { CHAIN } from "@/configs/env";
import { CRYPTO_PUNKS_ABI } from "@/contracts";
import { usePunkByTokenId } from "@/features/nft.hooks";
import { getCryptoPunkImage } from "@/features/nft.utls";
import { useIsWrappingTxStep1Confirmed } from "@/features/tx-watcher.hooks";
import {
  usePreferImpersonatedAccount,
  useUserProxyWallet,
} from "@/features/user.hooks";
import { CONTRACT_ADDRESS } from "@/utils/constants";
import { getEtherscanUrlByAddress } from "@/utils/etherscan";
import { shortenString } from "@/utils/string";
import { InfoCircleFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  Link as ChakraLink,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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

const WrappingModalFirstStepContent = () => {
  const qc = useQueryClient();
  const closeWrappingModal = useCloseWrappingModal();
  const { punkId } = useWrappingModal();

  const { isFetching: isFetchingPunk } = usePunkByTokenId(punkId);

  const { address, connector } = usePreferImpersonatedAccount();
  const { data: proxyWallet } = useUserProxyWallet(address || "");

  const addWrapStepOneTransactionToMonitor =
    useAddWrapStepOneTransactionToMonitor();
  const removeTxn = useRemoveWrapStepOneTransactionToMonitor();

  const { config: transferPunkConfig } = usePrepareContractWrite({
    chainId: CHAIN.id,
    address: CONTRACT_ADDRESS.CRYPTO_PUNKS as `0x${string}`,
    abi: CRYPTO_PUNKS_ABI,
    functionName: "transferPunk",
    args: punkId !== null ? [proxyWallet, punkId] : undefined,
  });
  const {
    data: transferPunkTxData,
    isSuccess: isTransferPunkTransactionSent,
    isError: isTransferringPunkError,
    write: transferPunk,
  } = useContractWrite({
    ...transferPunkConfig,
    onSuccess: (data) => {
      addWrapStepOneTransactionToMonitor(data.hash);
    },
  });
  const { isError: isTransactionError } = useWaitForTransaction({
    hash: transferPunkTxData?.hash,
  });

  const { data: txConfirmation, refetch: refetchTxConfirmation } =
    useIsWrappingTxStep1Confirmed(transferPunkTxData?.hash);

  const [isTransferringPunk, setIsTransferringPunk] = useState(false);

  useEffect(() => {
    (isTransferringPunkError || isTransactionError) &&
      setIsTransferringPunk(false);
  }, [isTransferringPunkError, isTransactionError]);

  useEffect(() => {
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
  }, [qc, txConfirmation, refetchTxConfirmation]);

  useEffect(() => {
    if (txConfirmation?.status === "confirmed") {
      qc.invalidateQueries(["punk", punkId]);
      qc.invalidateQueries(["cryptoPunksForOwner"]);
      setIsTransferringPunk(false);
      transferPunkTxData && removeTxn(transferPunkTxData.hash);
    }
  }, [qc, punkId, transferPunkTxData, removeTxn, txConfirmation]);

  const closeModal = useMemo(
    () => () => {
      if (!isTransferringPunk && !isFetchingPunk) closeWrappingModal();
    },
    [isTransferringPunk, isFetchingPunk, closeWrappingModal]
  );

  return (
    <Modal isOpen onClose={() => closeModal()} isCentered size="lg">
      <ModalOverlay />
      <ModalContent px={4} py={12} borderRadius="2xl">
        {!isTransferringPunk && !isFetchingPunk && (
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
                <Box
                  h={1}
                  w="100px"
                  backgroundColor="primary.500"
                  opacity="30%"
                />
                <Box
                  w={6}
                  h={6}
                  backgroundColor="primary.500"
                  opacity="30%"
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
              <VStack spacing={4} maxW="20rem" mx="auto">
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
                <Text as="div">
                  You need to execute{" "}
                  <Box
                    as="span"
                    color="primary.500"
                    display="inline-flex"
                    fontWeight="bold"
                    alignItems="center"
                    columnGap={1}
                  >
                    <Text>2 transactions</Text>
                    <Popover placement="top">
                      <PopoverTrigger>
                        <Icon as={InfoCircleFilled} fontSize="sm" />
                      </PopoverTrigger>
                      <PopoverContent
                        fontWeight="normal"
                        color="chakra-body-text"
                        fontSize="xs"
                      >
                        <PopoverArrow />
                        <PopoverBody>
                          <Box mb={2}>
                            The first transaction will transfer your Cryptopunk
                            to your{" "}
                            <Box as="span" fontWeight="bold">
                              Proxy Wallet{" "}
                              <ChakraLink
                                isExternal
                                href={getEtherscanUrlByAddress(
                                  proxyWallet ?? ""
                                )}
                                textDecor="underline"
                              >
                                ({shortenString(proxyWallet)})
                              </ChakraLink>
                            </Box>
                          </Box>
                          <Box>
                            The second one will mint the corresponding
                            WrappedPunk
                          </Box>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>{" "}
                  in order to Wrap your CryptoPunk.
                </Text>
                <Text>
                  The first transaction will transfer your Cryptopunk to your
                  Proxy Wallet.
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <VStack w="100%" gap={0} alignItems="center">
                <Button
                  colorScheme="primary"
                  px={10}
                  onClick={() => {
                    if (proxyWallet && punkId !== null) {
                      transferPunk?.();
                      setIsTransferringPunk(true);
                    }
                  }}
                  isDisabled={connector?.name === "Impersonate"}
                >
                  Begin Wrapping
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
        {(isTransferringPunk || isFetchingPunk) && (
          <>
            <ModalHeader>
              <Text
                textAlign="center"
                color="primary.500"
                fontWeight={700}
                fontSize="2xl"
              >
                {isFetchingPunk
                  ? "Fetching punk data"
                  : isTransferPunkTransactionSent
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
      </ModalContent>
    </Modal>
  );
};

export default WrappingModalFirstStepContent;
