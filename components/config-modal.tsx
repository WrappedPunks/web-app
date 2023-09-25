import { ENV, NETWORK, setOverriddenNetwork } from "@/configs/env";
import {
  getImpersonatedAddress,
  setImpersonatedAddress,
} from "@/features/user.utils";
import { TNetworkType } from "@/types";
import { shortenString } from "@/utils/string";
import { TeamOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import NoSsr from "./no-ssr";

const configModalAtom = atom(false);

const ConfigModalComponent = () => {
  const [isOpen, setIsOpen] = useAtom(configModalAtom);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ".") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", listener, false);
    return () => {
      window.removeEventListener("keydown", listener, false);
    };
  }, [setIsOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ConfigModalContent />
      </Modal>
      <ImpersonationIndicator />
    </>
  );
};

const ConfigModalContent = () => {
  const [network, setNetwork] = useState(NETWORK);
  const [address, setAddress] = useState(() => getImpersonatedAddress() || "");

  const apply = () => {
    setOverriddenNetwork(network);
    setImpersonatedAddress(address.trim());
    window.location.reload();
  };

  const reset = () => {
    setOverriddenNetwork();
    setImpersonatedAddress();
    window.location.reload();
  };

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>Configuration</ModalHeader>
      <ModalBody>
        <VStack w="full" spacing={4}>
          <FormControl>
            <FormLabel>Network</FormLabel>
            <Select
              value={network}
              onChange={(e) => setNetwork(e.target.value as TNetworkType)}
              autoFocus
            >
              <option value="mainnet">Mainnet</option>
              <option value="testnet">Testnet</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Impersonate account</FormLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <HStack>
          <Button onClick={reset}>Restore Defaults</Button>
          <Button variant="solid" colorScheme="primary" onClick={apply}>
            Apply
          </Button>
        </HStack>
      </ModalFooter>
    </ModalContent>
  );
};

const ImpersonationIndicator = () => {
  const impersonatedAddress = getImpersonatedAddress();
  return (
    <NoSsr>
      {!!impersonatedAddress && (
        <Center
          pos="fixed"
          left={4}
          bottom={4}
          px={3}
          h="2.5rem"
          borderRadius="1.75rem"
          backgroundColor="orange.500"
          color="white"
          cursor="help"
          transition="transform 0.3s ease"
          _hover={{
            transform: "scale(1.05)",
          }}
        >
          <Tooltip
            label={
              <Text wordBreak="break-all">
                {`You're impersonating `}
                <Box as="b">{impersonatedAddress}</Box>
              </Text>
            }
            wordBreak="break-all"
            borderRadius="md"
            px={3}
            py={2}
            fontSize="xs"
            offset={[12, 12]}
          >
            <HStack>
              <Icon as={TeamOutlined} fontSize="xs" />
              <Box>
                <Text fontSize="xs" lineHeight="1.2">
                  Impersonating
                </Text>
                <Text fontSize="xs" fontWeight="semibold">
                  {shortenString(impersonatedAddress)}
                </Text>
              </Box>
            </HStack>
          </Tooltip>
        </Center>
      )}
    </NoSsr>
  );
};

const DummyComponent = () => null;

const ConfigModal =
  ENV === "production" ? DummyComponent : ConfigModalComponent;

export default ConfigModal;
