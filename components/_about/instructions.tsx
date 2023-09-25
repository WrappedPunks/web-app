import { CONTRACT_ADDRESS } from "@/utils/constants";
import { getEtherscanUrlByAddress } from "@/utils/etherscan";
import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  HStack,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface InstructionsTab {
  label: string;
  query: string;
}

const TABS: InstructionsTab[] = [
  {
    label: "Wrap Instructions",
    query: "wrap",
  },
  {
    label: "Unwrap Instructions",
    query: "unwrap",
  },
];

export default function Instructions() {
  const { query } = useRouter();

  const selectedTab = useMemo(() => {
    return query.instructions
      ? TABS.findIndex((info) => info.query === query.instructions)
      : 0;
  }, [query]);

  return (
    <VStack gap={10}>
      <HStack>
        <Button
          variant="text"
          as={Link}
          href={{
            pathname: "/about",
            query: { tab: "instructions", instructions: TABS[0].query },
          }}
          color={selectedTab === 0 ? "primary.500" : "gray.500"}
          fontWeight={700}
          fontSize="2xl"
        >
          {TABS[0].label}
        </Button>
        <Box w="2px" h={5} backgroundColor="gray.300" />
        <Button
          variant="text"
          as={Link}
          href={{
            pathname: "/about",
            query: { tab: "instructions", instructions: TABS[1].query },
          }}
          color={selectedTab === 1 ? "primary.500" : "gray.500"}
          fontWeight={700}
          fontSize="2xl"
        >
          {TABS[1].label}
        </Button>
      </HStack>
      {selectedTab === 0 && (
        <VStack gap={10} w="100%">
          <HStack gap={5} w="100%" alignItems="flex-start">
            <Center
              backgroundColor="primary.500"
              borderRadius="full"
              color="white"
              fontWeight={600}
              fontSize="xl"
              w={12}
              h={12}
              flexShrink={0}
            >
              <Text>A</Text>
            </Center>
            <VStack gap={10} fontSize="lg">
              <VStack
                gap={0}
                h={12}
                justifyContent="space-between"
                alignItems="flex-start"
                w="100%"
              >
                <Text textAlign="left">Get your proxy wallet</Text>
                <Text textAlign="left" color="gray.500">
                  Send Transaction via WrappedPunk contract if needed
                </Text>
              </VStack>
              <OrderedList
                textAlign="left"
                ml={10}
                spacing={5}
                fontWeight={400}
              >
                <ListItem>
                  <ChakraLink
                    textDecoration="underline"
                    isExternal
                    href={`${getEtherscanUrlByAddress(
                      CONTRACT_ADDRESS.WRAPPED_PUNKS
                    )}#readContract`}
                  >
                    View Contract
                  </ChakraLink>{" "}
                  on etherscan
                </ListItem>
                <ListItem>Call function &quot;9. proxyInfo&quot;</ListItem>
                <ListItem>
                  <VStack gap={0} alignItems="flex-start">
                    <Text textAlign="left" fontWeight={700}>
                      If the address that appears is 0x00...0000:
                    </Text>
                    <Text textAlign="left">
                      Continue to step 4 to deploy a proxy wallet and get its
                      address.
                    </Text>
                    <Text textAlign="left" mt={3} fontWeight={700}>
                      If the address that appears is NOT 0x00...0000:
                    </Text>
                    <Text textAlign="left">
                      This is your proxy wallet address, save it and proceed to
                      the block of instructions &apos;B&apos;
                    </Text>
                  </VStack>
                </ListItem>
                <ListItem>
                  Click on the &apos;Write Contract&apos; tab,
                  <br />
                  connect your wallet and call function ‘5. registerProxy’ and
                  wait for the Tx to be confirmed.
                </ListItem>
                <ListItem>
                  Click on the &apos;Read Contract &apos; tab,
                  <br />
                  call function &quot;9. proxyInfo&quot; to get your proxy
                  wallet address (you have to click &apos;Query&apos; again)
                </ListItem>
              </OrderedList>
            </VStack>
          </HStack>
          <Box h="2px" w="100%" backgroundColor="gray.200" />
          <HStack gap={5} w="100%" alignItems="flex-start">
            <Center
              backgroundColor="primary.500"
              borderRadius="full"
              color="white"
              fontWeight={600}
              fontSize="xl"
              w={12}
              h={12}
              flexShrink={0}
            >
              <Text>B</Text>
            </Center>
            <VStack gap={10} fontSize="lg">
              <VStack
                gap={0}
                h={12}
                justifyContent="space-between"
                alignItems="flex-start"
                w="100%"
              >
                <Text textAlign="left">Transfer your CryptoPunk</Text>
                <Text textAlign="left" color="gray.500">
                  Send Transaction via CryptoPunk contract
                </Text>
              </VStack>
              <OrderedList
                textAlign="left"
                ml={10}
                spacing={5}
                fontWeight={400}
              >
                <ListItem>
                  <ChakraLink
                    textDecoration="underline"
                    isExternal
                    href={`${getEtherscanUrlByAddress(
                      CONTRACT_ADDRESS.CRYPTO_PUNKS
                    )}#writeContract`}
                  >
                    View Contract
                  </ChakraLink>{" "}
                  on etherscan
                </ListItem>
                <ListItem>
                  Connect your wallet and call function “7. transferPunk”, with
                  the parameters:
                  <UnorderedList>
                    <ListItem>
                      <Text as="b">to</Text>: your proxy wallet address (should
                      be different from 0x00...0000)
                    </ListItem>
                    <ListItem>
                      <Text as="b">punkIndex</Text>: your CryptoPunk token Id
                    </ListItem>
                  </UnorderedList>
                </ListItem>
              </OrderedList>
            </VStack>
          </HStack>
          <Box h="2px" w="100%" backgroundColor="gray.200" />
          <HStack gap={5} w="100%" alignItems="flex-start">
            <Center
              backgroundColor="primary.500"
              borderRadius="full"
              color="white"
              fontWeight={600}
              fontSize="xl"
              w={12}
              h={12}
              flexShrink={0}
            >
              <Text>C</Text>
            </Center>
            <VStack gap={10} fontSize="lg">
              <VStack
                gap={0}
                h={12}
                justifyContent="space-between"
                alignItems="flex-start"
                w="100%"
              >
                <Text textAlign="left">Mint your WrappedPunk</Text>
                <Text textAlign="left" color="gray.500">
                  Send Transaction via WrappedPunk contract
                </Text>
              </VStack>
              <OrderedList
                textAlign="left"
                ml={10}
                spacing={5}
                fontWeight={400}
              >
                <ListItem>
                  <ChakraLink
                    textDecoration="underline"
                    isExternal
                    href={`${getEtherscanUrlByAddress(
                      CONTRACT_ADDRESS.WRAPPED_PUNKS
                    )}#writeContract`}
                  >
                    View Contract
                  </ChakraLink>{" "}
                  on etherscan
                </ListItem>
                <ListItem>
                  Connect your wallet and call function “3. mint”, with the
                  parameters:
                  <UnorderedList>
                    <ListItem>
                      <Text as="b">punkIndex</Text>: your CryptoPunk token Id
                    </ListItem>
                  </UnorderedList>
                </ListItem>
              </OrderedList>
            </VStack>
          </HStack>
          <Box h="2px" w="100%" backgroundColor="gray.200" />
          <HStack gap={5} w="100%" alignItems="flex-start">
            <Center
              backgroundColor="primary.500"
              borderRadius="full"
              color="white"
              fontWeight={600}
              fontSize="xl"
              w={12}
              h={12}
              flexShrink={0}
            >
              <Text>D</Text>
            </Center>
            <VStack gap={10} fontSize="lg">
              <VStack
                gap={0}
                h={12}
                justifyContent="center"
                alignItems="flex-start"
                w="100%"
              >
                <Text textAlign="left">
                  View your WrappedPunk on{" "}
                  <ChakraLink
                    isExternal
                    href="https://opensea.io/collection/wrapped-cryptopunks"
                    textDecoration="underline"
                  >
                    OpenSea
                  </ChakraLink>
                </Text>
              </VStack>
            </VStack>
          </HStack>
        </VStack>
      )}
      {selectedTab === 1 && (
        <VStack gap={10} w="100%">
          <HStack gap={5} w="100%" alignItems="flex-start">
            <Center
              backgroundColor="primary.500"
              borderRadius="full"
              color="white"
              fontWeight={600}
              fontSize="xl"
              w={12}
              h={12}
              flexShrink={0}
            >
              <Text>A</Text>
            </Center>
            <VStack gap={10} fontSize="lg">
              <VStack
                gap={0}
                h={12}
                justifyContent="space-between"
                alignItems="flex-start"
                w="100%"
              >
                <Text textAlign="left">Burn your Wrapped Punk</Text>
                <Text textAlign="left" color="gray.500">
                  Send Transaction via WrappedPunk contract
                </Text>
              </VStack>
              <OrderedList
                textAlign="left"
                ml={10}
                spacing={5}
                fontWeight={400}
              >
                <ListItem>
                  <ChakraLink
                    textDecoration="underline"
                    isExternal
                    href={`${getEtherscanUrlByAddress(
                      CONTRACT_ADDRESS.WRAPPED_PUNKS
                    )}#writeContract`}
                  >
                    View Contract
                  </ChakraLink>{" "}
                  on etherscan
                </ListItem>
                <ListItem>
                  Connect your wallet and call function &quot;2. burn&quot;,
                  with the parameters:
                  <UnorderedList>
                    <ListItem>
                      <Text as="b">punkIndex</Text>: your WrappedPunk token Id
                    </ListItem>
                  </UnorderedList>
                </ListItem>
              </OrderedList>
            </VStack>
          </HStack>
          <Box h="2px" w="100%" backgroundColor="gray.200" />

          <HStack gap={5} w="100%" alignItems="flex-start">
            <Center
              backgroundColor="primary.500"
              borderRadius="full"
              color="white"
              fontWeight={600}
              fontSize="xl"
              w={12}
              h={12}
              flexShrink={0}
            >
              <Text>B</Text>
            </Center>
            <VStack gap={10} fontSize="lg">
              <VStack
                gap={0}
                h={12}
                justifyContent="center"
                alignItems="flex-start"
                w="100%"
              >
                <Text textAlign="left">
                  View your CryptoPunk on{" "}
                  <ChakraLink
                    isExternal
                    href="https://opensea.io/collection/cryptopunks"
                    textDecoration="underline"
                  >
                    OpenSea
                  </ChakraLink>
                </Text>
              </VStack>
            </VStack>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}
