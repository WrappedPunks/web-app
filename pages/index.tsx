import NoSsr from "@/components/no-ssr";
import CryptopunksList from "@/components/punk-list/cryptopunks-list";
import WrappedPunkList from "@/components/punk-list/wrappedpunk-list";
import { IS_CONNECTION_DISABLED } from "@/configs/env";
import { pxToRem } from "@/configs/theme";
import { usePreferImpersonatedAccount } from "@/features/user.hooks";
import {
  CRYPTOPUNKS_APP_URL,
  LARVALABS_URL,
  WRAPPEDPUNKS_GITHUB_URL,
} from "@/utils/constants";
import {
  Box,
  Button,
  ButtonProps,
  Link as ChakraLink,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";

export default function Home() {
  const router = useRouter();
  const { isConnected, isDisconnected } = usePreferImpersonatedAccount();
  const { connect, connectors } = useConnect();
  const connector = connectors.find((c) => c.name === "MetaMask");

  const [isInitiallyConnected, setIsInitiallyConnected] = useState(isConnected);

  useEffect(() => {
    if (!isInitiallyConnected && isConnected) {
      router.push("/my-punks");
    }
    if (isDisconnected) {
      setIsInitiallyConnected(false);
    }
  }, [isConnected, isInitiallyConnected, isDisconnected, router]);

  return (
    <Flex flexDir="column" align="center" w="full">
      <Box
        textAlign="center"
        w="full"
        pb={{ base: "4rem", md: "5.5rem", lg: "6.5rem" }}
      >
        <Text
          maxW="3xl"
          mx="auto"
          fontSize={{
            base: pxToRem(28),
            sm: pxToRem(36),
            md: pxToRem(48),
            lg: pxToRem(80),
          }}
          fontWeight="extrabold"
        >
          Wrapped Punks
        </Text>
        <Text
          maxW="3xl"
          mx="auto"
          fontSize={{
            base: pxToRem(18),
            sm: pxToRem(20),
            md: pxToRem(24),
            lg: pxToRem(36),
          }}
          fontWeight="bold"
        >
          Turn your CryptoPunks into ERC721
        </Text>
        <Text
          maxW="3xl"
          mx="auto"
          fontSize="sm"
          fontWeight="medium"
          color="gray.500"
          mt={5}
        >
          The CryptoPunks are a set of 10,000 fixed digital collectibles minted
          on the Ethereum blockchain. They were created by Larvalabs in mid-2017
          and served as inspiration for the ERC-721 standard. These cryptopunks
          marked the beginning of a new chapter for digital art and paved the
          way for a whole new industry at the intersection of creativity and
          technology. Above all, the Cryptopunks continue to inspire a large
          number of creators, entrepreneurs, and artists around the world.
        </Text>
        <VStack
          w="100%"
          bgColor="#FAF2FF"
          borderRadius="2xl"
          fontSize="sm"
          p={{ base: 4, md: 8 }}
          gap={4}
          mt={8}
        >
          <Text>
            This application allows you to wrap and unwrap your Cryptopunk:
            click{" "}
            <Text as={Link} href="/about" textDecoration="underline">
              here
            </Text>{" "}
            to learn more.
          </Text>
          <Text>
            You can buy an original Cryptopunk at{" "}
            <ChakraLink
              isExternal
              href={LARVALABS_URL}
              textDecoration="underline"
            >
              {LARVALABS_URL}
            </ChakraLink>{" "}
            or at{" "}
            <ChakraLink
              isExternal
              href={CRYPTOPUNKS_APP_URL}
              textDecoration="underline"
            >
              {CRYPTOPUNKS_APP_URL}
            </ChakraLink>
          </Text>
          <Text>
            Wrappedpunks.com is free to use and open source: use it at your own
            risk.
          </Text>
          <Text>
            You can check the{" "}
            <ChakraLink
              isExternal
              href={WRAPPEDPUNKS_GITHUB_URL}
              textDecoration="underline"
            >
              Githhub
            </ChakraLink>{" "}
            and welcome to reach out for any suggestion.
          </Text>
        </VStack>
        <NoSsr>
          {!isConnected && !!connector?.ready && (
            <Button
              mt={8}
              size={{ base: "md", lg: "lg" }}
              colorScheme="primary"
              w={pxToRem(200)}
              onClick={() => {
                connect({ connector });
              }}
              isDisabled={IS_CONNECTION_DISABLED}
            >
              Connect
            </Button>
          )}
          {isConnected && (
            <Button
              as={Link}
              href="/my-punks"
              mt={{ base: 10, md: 14, lg: 20 }}
              size={{ base: "md", lg: "lg" }}
              colorScheme="primary"
              w={pxToRem(200)}
            >
              View My Punks
            </Button>
          )}
        </NoSsr>
      </Box>
      <PunkListTabs />
    </Flex>
  );
}

const PunkListTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <Flex w="full" gap={4} pb="1.5rem">
        <TabButton
          isActiveTab={selectedIndex === 0}
          onClick={() => setSelectedIndex(0)}
        >
          All Cryptopunks
        </TabButton>
        <Box w="2px" bgColor="gray.300" />
        <TabButton
          isActiveTab={selectedIndex === 1}
          onClick={() => setSelectedIndex(1)}
        >
          All Wrapped Punks
        </TabButton>
      </Flex>
      {selectedIndex === 0 && <CryptopunksList />}
      {selectedIndex === 1 && <WrappedPunkList />}
    </>
  );
};

interface TabButtonProps extends ButtonProps {
  isActiveTab?: boolean;
}

const TabButton = ({ isActiveTab, ...props }: TabButtonProps) => {
  return (
    <Button
      variant="unstyled"
      textDecor="none"
      fontWeight="bold"
      color={isActiveTab ? "primary.500" : "gray.500"}
      h={8}
      _hover={{ textDecor: "none" }}
      _active={{ opacity: 0.7 }}
      transition="all 0.3 ease"
      {...props}
    />
  );
};
