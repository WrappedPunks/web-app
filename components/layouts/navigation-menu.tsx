import { IS_CONNECTION_DISABLED } from "@/configs/env";
import { usePreferImpersonatedAccount } from "@/features/user.hooks";
import { setImpersonatedAddress } from "@/features/user.utils";
import { shortenString } from "@/utils/string";
import { CaretDownOutlined, DisconnectOutlined } from "@ant-design/icons";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useConnect, useDisconnect } from "wagmi";
import Logo from "../logo";

const navigationMenuAtom = atom(false);

export const useNavigationMenu = () => useAtom(navigationMenuAtom);

export default function NavigationMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useNavigationMenu();
  const { address, isConnected, connector } = usePreferImpersonatedAccount();

  const { connect, connectors } = useConnect();
  const metaMaskConnector = connectors.find((c) => c.name === "MetaMask");
  const { disconnect } = useDisconnect();

  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  useEffect(() => {
    router.events.on("routeChangeStart", onClose);
    return () => {
      router.events.off("routeChangeStart", onClose);
    };
  }, [onClose, router.events]);

  return (
    <Drawer
      autoFocus={false}
      isOpen={isOpen}
      size="md"
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader py={2} px={4}>
          <Flex justify="space-between" align="center">
            <Link href="/">
              <Logo fontSize="5xl" />
            </Link>
            <IconButton
              size="sm"
              aria-label="close-navigation-menu"
              icon={<CloseIcon />}
              variant="ghost"
              onClick={onClose}
            />
          </Flex>
        </DrawerHeader>
        <DrawerBody textAlign="center">
          <VStack spacing={4}>
            <Link href="/punks">
              <Text
                fontWeight="semibold"
                color={router.pathname === "/punks" ? "primary.500" : undefined}
              >
                All CryptoPunks
              </Text>
            </Link>
            {isConnected && (
              <Link href="/my-punks">
                <Text
                  fontWeight="semibold"
                  color={
                    router.pathname === "/my-punks" ? "primary.500" : undefined
                  }
                >
                  Wrapped Punks
                </Text>
              </Link>
            )}
            <Link href="/about">
              <Text
                fontWeight="semibold"
                color={router.pathname === "/about" ? "primary.500" : undefined}
              >
                About
              </Text>
            </Link>
          </VStack>
        </DrawerBody>
        <DrawerFooter display="flex" justifyContent="center">
          {!isConnected && !!metaMaskConnector?.ready ? (
            <Button
              w="10rem"
              onClick={() => connect({ connector: metaMaskConnector })}
              colorScheme="primary"
              isDisabled={IS_CONNECTION_DISABLED}
            >
              Connect
            </Button>
          ) : (
            <Menu placement="auto" autoSelect={false}>
              <MenuButton color="gray.600">
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
                    isDisabled={IS_CONNECTION_DISABLED}
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
