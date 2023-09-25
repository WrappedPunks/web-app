import NoSsr from "@/components/no-ssr";
import {
  useCryptoPunksForOwner,
  useWrappedPunksForOwner,
} from "@/features/nft.hooks";
import { PunkDetails } from "@/features/nft.types";
import { getCryptoPunkImage } from "@/features/nft.utls";
import {
  usePreferImpersonatedAccount,
  useUserProxyWallet,
} from "@/features/user.hooks";
import { createDummyArray } from "@/utils/array";
import { getEtherscanUrlByAddress } from "@/utils/etherscan";
import { shortenString } from "@/utils/string";
import { getWrappedPunkImageUrl } from "@/utils/wrappedpunks";
import { InfoCircleFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  Image as ChakraImage,
  Link as ChakraLink,
  Grid,
  GridItem,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Text,
  VStack,
  useUnmountEffect,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

interface WalletTab {
  label: string;
  query: string;
}

const TABS: WalletTab[] = [
  {
    label: "My CryptoPunks",
    query: "crypto-punks",
  },
  {
    label: "My Wrapped Punks",
    query: "wrapped-punks",
  },
];

const MyPunks = () => {
  const { query } = useRouter();

  const selectedTab = useMemo(() => {
    return query.type ? TABS.findIndex((info) => info.query === query.type) : 0;
  }, [query]);

  const { address } = usePreferImpersonatedAccount();
  const { data: userProxyWallet, isFetching: isLoadingUserProxyWallet } =
    useUserProxyWallet(address || "");

  const [allPendingCryptoPunksForOwner, setAllPendingCryptoPunksForOwner] =
    useState<PunkDetails[]>([]);
  const [allCryptoPunksForOwner, setAllCryptoPunksForOwner] = useState<
    PunkDetails[]
  >([]);
  const [allWrappedPunksForOwner, setAllWrappedPunksForOwner] = useState<
    PunkDetails[]
  >([]);

  const {
    data: cryptoPunksInProxyWallet,
    isFetching: isLoadingCryptoPunksInProxyWallet,
    isSuccess: isSuccessCryptoPunksInProxyWallet,
    remove: removeCryptoPunksInProxyWallet,
  } = useCryptoPunksForOwner(userProxyWallet || "0x");
  const {
    data: cryptoPunksForOwner,
    isFetching: isLoadingCryptoPunks,
    isSuccess: isSuccessCryptoPunks,
    remove: removeCryptoPunksForOwner,
  } = useCryptoPunksForOwner(address || "0x");
  const {
    data: wrappedPunksForOwner,
    isFetching: isLoadingWrappedPunks,
    isSuccess: isSuccessWrappedPunks,
    remove: removeWrappedPunksForOwner,
  } = useWrappedPunksForOwner(address || "0x");

  const isLoading = useMemo(
    () =>
      isLoadingCryptoPunksInProxyWallet ||
      isLoadingCryptoPunks ||
      isLoadingWrappedPunks ||
      isLoadingUserProxyWallet,
    [
      isLoadingCryptoPunksInProxyWallet,
      isLoadingCryptoPunks,
      isLoadingWrappedPunks,
      isLoadingUserProxyWallet,
    ]
  );

  useEffect(() => {
    if (isSuccessCryptoPunksInProxyWallet) {
      // only push the data different from what we already have
      setAllPendingCryptoPunksForOwner((prevState) =>
        [
          ...prevState,
          ...cryptoPunksInProxyWallet
            .filter(
              (punk) =>
                !prevState.find((combinedPunk) => combinedPunk.id === punk.id)
            )
            .map((punk) => ({
              ...punk,
              wrapped: false,
            })),
        ].sort((a, b) => a.id - b.id)
      );
    }
  }, [cryptoPunksInProxyWallet, isSuccessCryptoPunksInProxyWallet]);

  useEffect(() => {
    if (isSuccessCryptoPunks) {
      // only push the data different from what we already have
      setAllCryptoPunksForOwner((prevState) =>
        [
          ...prevState,
          ...cryptoPunksForOwner.filter(
            (punk) =>
              !prevState.find((combinedPunk) => combinedPunk.id === punk.id)
          ),
        ].sort((a, b) => a.id - b.id)
      );
    }
  }, [cryptoPunksForOwner, isSuccessCryptoPunks]);

  useEffect(() => {
    if (isSuccessWrappedPunks) {
      // only push the data different from what we already have
      setAllWrappedPunksForOwner((prevState) =>
        [
          ...prevState,
          ...wrappedPunksForOwner.filter(
            (punk) =>
              !prevState.find((combinedPunk) => combinedPunk.id === punk.id)
          ),
        ].sort((a, b) => a.id - b.id)
      );

      setAllPendingCryptoPunksForOwner((prevState) =>
        [
          ...prevState,
          ...wrappedPunksForOwner
            .filter(
              (punk) =>
                !prevState.find((combinedPunk) => combinedPunk.id === punk.id)
            )
            .map((punk) => ({
              ...punk,
              isWrapped: true,
            })),
        ].sort((a, b) => a.id - b.id)
      );
    }
  }, [wrappedPunksForOwner, isSuccessWrappedPunks]);

  useUnmountEffect(() => {
    removeCryptoPunksInProxyWallet();
    removeCryptoPunksForOwner();
    removeWrappedPunksForOwner();
  }, [
    removeCryptoPunksInProxyWallet,
    removeCryptoPunksForOwner,
    removeWrappedPunksForOwner,
  ]);

  return (
    <VStack gap={12} alignItems={{ base: "center", md: "flex-start" }}>
      <HStack gap={2}>
        <Button
          variant="text"
          pl={{ base: undefined, md: 0 }}
          as={Link}
          href={{ pathname: "/my-punks", query: { type: TABS[0].query } }}
          color={selectedTab === 0 ? "primary.500" : "gray.500"}
          fontWeight="semibold"
        >
          {TABS[0].label}
        </Button>
        <Box background="gray.300" w="2px" h={4} />
        <Button
          variant="text"
          as={Link}
          href={{ pathname: "/my-punks", query: { type: TABS[1].query } }}
          color={selectedTab === 1 ? "primary.500" : "gray.500"}
          fontWeight="semibold"
        >
          {TABS[1].label}
        </Button>
      </HStack>
      <NoSsr>
        {selectedTab === 0 &&
          !isLoading &&
          allPendingCryptoPunksForOwner.length > 0 && (
            <Box w="full" borderBottom="1px solid gray.300">
              <Text mb={10} fontWeight="semibold" color="gray.500">
                Wrapped contract
              </Text>
              <Grid
                templateColumns={{
                  base: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(5, 1fr)",
                }}
                gap={{
                  base: 3,
                  sm: 4,
                  md: 6,
                  lg: 10,
                }}
              >
                {allPendingCryptoPunksForOwner.map((punk) => (
                  <GridItem key={`pending-${punk.id}`}>
                    <Link href={`/punk/${punk.id}`}>
                      <Box
                        borderRadius="sm"
                        w="full"
                        aspectRatio={1}
                        backgroundColor="cryptopunksBg"
                      >
                        <ChakraImage src={getCryptoPunkImage(punk.id)} />
                      </Box>
                    </Link>

                    <Text
                      fontSize="sm"
                      fontWeight={700}
                      color={punk.isWrapped ? "primary.500" : "gray.500"}
                    >
                      {punk.isWrapped ? "WRAPPED" : "PENDING"}{" "}
                      <Popover>
                        <PopoverTrigger>
                          <Icon as={InfoCircleFilled} fontSize="sm" />
                        </PopoverTrigger>
                        <PopoverContent
                          p={5}
                          fontSize="xs"
                          fontWeight={500}
                          color="chakra-body-text"
                        >
                          <PopoverArrow />
                          {punk.isWrapped ? (
                            <VStack>
                              <Text>
                                This CryptoPunk is wrapped and now in the
                                WarppedPunk smart contract.
                              </Text>
                              <Text>
                                You can Unwrap your WrappedPunk to transfer back
                                the original CryptoPunk in your own wallet.
                              </Text>
                            </VStack>
                          ) : (
                            <VStack>
                              <Text>
                                This CryptoPunk is in your own proxy wallet{" "}
                                {userProxyWallet && (
                                  <>
                                    (
                                    <ChakraLink
                                      textDecoration="underline"
                                      href={getEtherscanUrlByAddress(
                                        userProxyWallet
                                      )}
                                    >
                                      {shortenString(userProxyWallet)}
                                    </ChakraLink>
                                    )
                                  </>
                                )}
                                .
                              </Text>
                              <Text>
                                You need to send 1 more transaction to finish
                                the wrapping process.
                              </Text>
                            </VStack>
                          )}
                        </PopoverContent>
                      </Popover>
                    </Text>
                    <Link href={`/punk/${punk.id}`}>
                      <Text
                        fontSize={{
                          base: "md",
                          md: "lg",
                          lg: "xl",
                        }}
                        noOfLines={2}
                        fontWeight="bold"
                        textAlign="center"
                      >
                        #{punk.id}
                      </Text>
                      {!punk.isWrapped && (
                        <Button colorScheme="primary" w="100%">
                          Continue
                        </Button>
                      )}
                    </Link>
                  </GridItem>
                ))}
              </Grid>
              <Box h="2px" w="100%" backgroundColor="gray.200" mt={10} />
            </Box>
          )}
        <Box w="full">
          {selectedTab == 0 && allPendingCryptoPunksForOwner.length > 0 && (
            <Text mb={5} fontWeight="semibold" color="gray.500">
              In my wallet
            </Text>
          )}
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={{
              base: 3,
              sm: 4,
              md: 6,
              lg: 10,
            }}
          >
            {isLoading &&
              createDummyArray(10).map((item) => (
                <GridItem key={item}>
                  <Skeleton w="full" aspectRatio={1} suppressHydrationWarning />
                </GridItem>
              ))}
            {selectedTab === 0 && !isLoading && (
              <>
                {allCryptoPunksForOwner.length > 0 &&
                  allCryptoPunksForOwner.map((punk) => (
                    <GridItem key={`pending-${punk.id}`}>
                      <Link href={`/punk/${punk.id}`}>
                        <Box
                          borderRadius="sm"
                          w="full"
                          aspectRatio={1}
                          backgroundColor="cryptopunksBg"
                        >
                          <ChakraImage src={getCryptoPunkImage(punk.id)} />
                        </Box>
                        <Text
                          mt={5}
                          fontSize={{
                            base: "md",
                            md: "lg",
                            lg: "xl",
                          }}
                          noOfLines={2}
                          fontWeight="bold"
                          textAlign="center"
                        >
                          #{punk.id}
                        </Text>
                      </Link>
                    </GridItem>
                  ))}
              </>
            )}
            {selectedTab === 1 && !isLoading && (
              <>
                {allWrappedPunksForOwner.length > 0 &&
                  allWrappedPunksForOwner.map((punk) => (
                    <GridItem key={`pending-${punk.id}`}>
                      <Link href={`/punk/${punk.id}`}>
                        <Box borderRadius="md" w="full" aspectRatio={1}>
                          <ChakraImage src={getWrappedPunkImageUrl(punk.id)} />
                        </Box>
                        <Text
                          mt={5}
                          fontSize={{
                            base: "sm",
                            sm: "md",
                            md: "lg",
                            lg: "xl",
                          }}
                          noOfLines={2}
                          fontWeight="bold"
                          textAlign="center"
                        >
                          W#{punk.id}
                        </Text>
                      </Link>
                    </GridItem>
                  ))}
              </>
            )}
          </Grid>
          {!isLoading &&
            selectedTab === 0 &&
            allCryptoPunksForOwner.length === 0 && (
              <Text textAlign="center" fontWeight="semibold" color="gray.500">
                No CryptoPunks found
              </Text>
            )}
          {!isLoading &&
            selectedTab === 1 &&
            allWrappedPunksForOwner.length === 0 && (
              <Text textAlign="center" fontWeight="semibold" color="gray.500">
                No WrappedPunks found
              </Text>
            )}
        </Box>
      </NoSsr>
    </VStack>
  );
};

export default MyPunks;
