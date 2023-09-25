import EtherscanIcon from "@/components/icons/etherscan";
import {
  useAddDeployProxyWalletTransactionToMonitor,
  useRemoveDeployProxyWalletTransactionToMonitor,
} from "@/components/transactions-monitor/transactions-monitor.atoms";
import { CHAIN } from "@/configs/env";
import { WRAPPED_PUNK_ABI } from "@/contracts";
import {
  usePreferImpersonatedAccount,
  useUserProxyWallet,
} from "@/features/user.hooks";
import {
  CONTRACT_ADDRESS,
  CRYPTOPUNKS_DISCORD_URL,
  TWITTER_URL,
} from "@/utils/constants";
import { getEtherscanUrlByAddress } from "@/utils/etherscan";
import { CheckCircleIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  Link as ChakraLink,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useClipboard,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { decodeEventLog } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useCloseWrappingModal } from "./wrapping-modal.atoms";

const RegisterProxyModalContent = () => {
  const qc = useQueryClient();
  const closeWrappingModal = useCloseWrappingModal();
  const { address, connector } = usePreferImpersonatedAccount();
  const { onCopy, setValue, hasCopied, value } = useClipboard("");
  const { isFetching: isFetchingProxyWallet } = useUserProxyWallet(
    address || ""
  );

  const addDeployProxyWalletTransactionToMonitor =
    useAddDeployProxyWalletTransactionToMonitor();
  const removeTxn = useRemoveDeployProxyWalletTransactionToMonitor();

  const { config: registerProxyConfig } = usePrepareContractWrite({
    chainId: CHAIN.id,
    address: CONTRACT_ADDRESS.WRAPPED_PUNKS as `0x${string}`,
    abi: WRAPPED_PUNK_ABI,
    functionName: "registerProxy",
  });
  const {
    data: registerProxyTxData,
    isSuccess: isRegisterProxyTransactionSent,
    isError: isRegisteringProxyError,
    write: registerProxy,
  } = useContractWrite({
    ...registerProxyConfig,
    onSuccess: (data) => {
      addDeployProxyWalletTransactionToMonitor(data.hash);
    },
  });

  const {
    data: TxDataResult,
    isError: isTransactionError,
    isSuccess: isTransactionSuccess,
  } = useWaitForTransaction({
    hash: registerProxyTxData?.hash,
  });

  const [isRegisteringProxy, setIsRegisteringProxy] = useState(false);

  useEffect(() => {
    (isRegisteringProxyError || isTransactionError) &&
      setIsRegisteringProxy(false);
  }, [isRegisteringProxyError, isTransactionError]);

  useEffect(() => {
    if (isTransactionSuccess) {
      setIsRegisteringProxy(false);
      registerProxyTxData && removeTxn(registerProxyTxData.hash);
      TxDataResult &&
        setValue(
          (
            decodeEventLog({
              abi: WRAPPED_PUNK_ABI,
              data: TxDataResult?.logs[0].data,
              topics: TxDataResult?.logs[0].topics || [],
            }).args as { user: string; proxy: string }
          ).proxy
        );
    }
  }, [
    isTransactionSuccess,
    registerProxyTxData,
    removeTxn,
    TxDataResult,
    setValue,
  ]);

  const closeModal = useMemo(
    () => () => {
      if (!isRegisteringProxy) {
        if (isTransactionSuccess) qc.invalidateQueries(["userProxyWallet"]);
        closeWrappingModal();
      }
    },
    [isRegisteringProxy, closeWrappingModal, isTransactionSuccess, qc]
  );

  return (
    <Modal isOpen onClose={() => closeModal()} isCentered size="lg">
      <ModalOverlay />
      <ModalContent px={4} py={12} borderRadius="2xl">
        {!isRegisteringProxy && !isTransactionSuccess && (
          <>
            <ModalHeader>
              <Text
                textAlign="center"
                color="primary.500"
                fontWeight={700}
                fontSize="2xl"
              >
                Create your Wrapped Punks Wallet
              </Text>
            </ModalHeader>
            <ModalBody py={8}>
              <VStack spacing={4} w="fit-content" maxW="375px" mx="auto">
                <Text textAlign="left" w="100%">
                  When you Wrap your first Punk, you need to create a proxy
                  wallet.{" "}
                </Text>
                <Text textAlign="left" w="100%">
                  Only you control the Wallet, and you only have to do this one
                  time.
                </Text>
                <Text textAlign="left" w="100%">
                  DM us on{" "}
                  <ChakraLink
                    isExternal
                    href={TWITTER_URL}
                    textDecor="underline"
                  >
                    Twitter
                  </ChakraLink>{" "}
                  if you have any question.
                </Text>
                <Text textAlign="left" w="100%">
                  You can also visit the official{" "}
                  <ChakraLink
                    isExternal
                    href={CRYPTOPUNKS_DISCORD_URL}
                    textDecor="underline"
                  >
                    Cryptopunks Discord
                  </ChakraLink>{" "}
                  where we hang out with the community of Cryptopunks owners.
                </Text>
                <Text textAlign="left" w="100%">
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
                    registerProxy?.();
                    setIsRegisteringProxy(true);
                  }}
                  isDisabled={connector?.name === "Impersonate"}
                >
                  Create Wallet
                </Button>
                <Button
                  variant="text"
                  onClick={closeWrappingModal}
                  textDecoration="underline"
                  color="gray.500"
                  fontWeight="normal"
                >
                  Back
                </Button>
              </VStack>
            </ModalFooter>
          </>
        )}
        {isRegisteringProxy && (
          <>
            <ModalHeader>
              <Text
                textAlign="center"
                color="primary.500"
                fontWeight={700}
                fontSize="2xl"
              >
                {isRegisterProxyTransactionSent
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
        {!isRegisteringProxy && isTransactionSuccess && (
          <>
            <ModalHeader>
              <Text
                textAlign="center"
                color="primary.500"
                fontWeight={700}
                fontSize="2xl"
              >
                Wallet Successfully Created
              </Text>
            </ModalHeader>
            <ModalBody py={8}>
              <Text textAlign="center" fontWeight={700} color="gray.500" mb={2}>
                Your Proxy Wallet Address
              </Text>
              <HStack
                border="2px solid"
                borderColor="gray.300"
                borderRadius="md"
                gap={1}
              >
                <Text
                  fontSize="sm"
                  borderRight="2px solid"
                  borderColor="gray.300"
                  color="gray.500"
                  p={2}
                >
                  {value}
                </Text>
                <HStack justifyContent="space-around" gap={1}>
                  <IconButton
                    onClick={onCopy}
                    variant="ghost"
                    aria-label="copy proxy wallet address"
                    icon={hasCopied ? <CheckCircleIcon /> : <CopyIcon />}
                    color={hasCopied ? "green.500" : undefined}
                    fontSize="lg"
                    size="xs"
                  />
                  <IconButton
                    variant="ghost"
                    aria-label="view proxy wallet address on etherscan"
                    icon={<EtherscanIcon />}
                    fontSize="lg"
                    size="xs"
                    as={ChakraLink}
                    href={getEtherscanUrlByAddress(
                      (
                        decodeEventLog({
                          abi: WRAPPED_PUNK_ABI,
                          data: TxDataResult?.logs[0].data,
                          topics: TxDataResult?.logs[0].topics || [],
                        }).args as { user: string; proxy: string }
                      ).proxy
                    )}
                    isExternal
                  />
                </HStack>
              </HStack>
            </ModalBody>
            <ModalFooter>
              <VStack w="100%" gap={0} alignItems="center">
                <Button
                  colorScheme="primary"
                  px={10}
                  onClick={() => qc.invalidateQueries(["userProxyWallet"])}
                  isLoading={isFetchingProxyWallet}
                >
                  Continue
                </Button>
              </VStack>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RegisterProxyModalContent;
