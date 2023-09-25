import { CHAIN, IS_CONNECTION_DISABLED } from "@/configs/env";
import { usePreferImpersonatedAccount } from "@/features/user.hooks";
import { setImpersonatedAddress } from "@/features/user.utils";
import { shortenString } from "@/utils/string";
import { CaretDownOutlined, DisconnectOutlined } from "@ant-design/icons";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Hide,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Spacer,
  Text,
  TextProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import GeneralContainer from "../general-container";
import Logo from "../logo";
import NoSsr from "../no-ssr";
import { useNavigationMenu } from "./navigation-menu";

export const useHeaderHeight = () => {
  return useBreakpointValue({
    base: "4rem",
    lg: "5.75rem",
  });
};

export default function Header() {
  const height = useHeaderHeight();
  const { address, isConnected, connector } = usePreferImpersonatedAccount();
  const { disconnect } = useDisconnect();

  const { connect, connectors } = useConnect();
  const metaMaskConnector = connectors.find((c) => c.name === "MetaMask");

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [, setIsOpen] = useNavigationMenu();
  const router = useRouter();

  const shouldShowConnectBtn = router.pathname !== "/" && !isConnected;

  return (
    <Flex
      as="nav"
      w="full"
      h={height}
      justify="center"
      position="sticky"
      top={0}
      bg="white"
      zIndex="sticky"
    >
      <NoSsr>
        <GeneralContainer
          display="flex"
          w="full"
          py={5}
          px={4}
          justifyContent={!isConnected ? "center" : undefined}
          alignItems="center"
        >
          <Link href="/">
            <Logo fontSize="5xl" />
          </Link>
          <Spacer />
          <HStack spacing={8}>
            <Show above="md">
              <Link href="/punks">
                <NavItemText isEmphasized={router.pathname === "/punks"}>
                  All CryptoPunks
                </NavItemText>
              </Link>
              {isConnected && (
                <Link href="/my-punks">
                  <NavItemText isEmphasized={router.pathname === "/my-punks"}>
                    My Punks
                  </NavItemText>
                </Link>
              )}
              <Link href="/about">
                <NavItemText isEmphasized={router.pathname === "/about"}>
                  About
                </NavItemText>
              </Link>
              {shouldShowConnectBtn && (
                <Button
                  w="8rem"
                  colorScheme="primary"
                  onClick={() => {
                    connect({ connector: metaMaskConnector });
                  }}
                  isDisabled={IS_CONNECTION_DISABLED}
                >
                  Connect
                </Button>
              )}
              {isConnected && (
                <Menu placement="bottom-end" autoSelect={false}>
                  <MenuButton color="gray.600" fontWeight="medium">
                    {shortenString(address)}
                    <Icon as={CaretDownOutlined} ml={1} />
                  </MenuButton>
                  <MenuList minW="14rem" border="none" shadow="lg">
                    {connector?.name !== "Impersonate" && (
                      <MenuItem
                        onClick={() => {
                          disconnect();
                          router.replace("/");
                        }}
                        icon={<Icon as={DisconnectOutlined} />}
                        fontWeight="medium"
                      >
                        Disconnect
                      </MenuItem>
                    )}
                    {connector?.name === "Impersonate" && (
                      <MenuItem
                        onClick={() => {
                          setImpersonatedAddress();
                          window.location.href = "/";
                        }}
                        icon={<Icon as={DisconnectOutlined} />}
                        fontWeight="medium"
                      >
                        Stop Impersonating
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </Show>
            <Hide above="md">
              <IconButton
                aria-label="navigation-menu"
                colorScheme="primary"
                variant="ghost"
                icon={<HamburgerIcon />}
                onClick={() => setIsOpen(true)}
              />
            </Hide>
          </HStack>
        </GeneralContainer>
        {isConnected && chain && chain.id !== CHAIN.id && (
          <Box
            position="absolute"
            backgroundColor="primary.500"
            w="100%"
            p={2}
            top={height}
          >
            <Text
              color="white"
              w="fit-content"
              textAlign="left"
              fontSize="sm"
              fontWeight={500}
              mx="auto"
            >
              You&apos;re viewing data from the {CHAIN.name} network, but your
              wallet is connected to{" "}
              {chain.unsupported ? "another" : `the ${chain.name}`} network.{" "}
              <Text
                as="button"
                variant="unstyled"
                textDecoration="underline"
                fontSize="sm"
                fontWeight={500}
                onClick={() => switchNetwork?.(CHAIN.id)}
              >
                Switch network
              </Text>
            </Text>
          </Box>
        )}
      </NoSsr>
    </Flex>
  );
}

interface NavItemText extends TextProps {
  isEmphasized?: boolean;
}

const NavItemText = ({ isEmphasized, ...props }: NavItemText) => {
  return (
    <Text
      fontWeight="semibold"
      color={isEmphasized ? "primary.500" : "gray.800"}
      transition="color 0.3s ease, transform 0.2s ease"
      _active={{
        transform: "scale(0.97)",
      }}
      {...props}
    />
  );
};
