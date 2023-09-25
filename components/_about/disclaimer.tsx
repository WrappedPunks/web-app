import { Link as ChakraLink, Text, VStack } from "@chakra-ui/react";

export default function Disclaimer() {
  return (
    <VStack gap={10} alignItems="flex-start">
      <Text textAlign="left" fontWeight={600} fontSize="xl">
        Disclaimer
      </Text>
      <Text textAlign="left" fontWeight={400}>
        Please be aware that the process of wrapping a CryptoPunks involves
        certain risks.
      </Text>
      <Text textAlign="left" fontWeight={400}>
        While we strive to provide a seamless and secure service, we cannot
        guarantee that your CryptoPunks will not be lost during the wrapping
        process due to unforeseen circumstances or technical issues.
      </Text>
      <Text textAlign="left" fontWeight={400}>
        By using our services, you acknowledge and agree that{" "}
        <ChakraLink
          isExternal
          href="https://wrappedpunks.com"
          textDecoration="underline"
        >
          WrappedPunks.com
        </ChakraLink>
        , its owners, employees, and affiliates, will not be held responsible or
        liable for any loss, damage, or inconvenience caused or alleged to be
        caused by the use of our services. This includes, but is not limited to,
        the loss of your CryptoPunks during the wrapping process.
      </Text>
      <Text textAlign="left" fontWeight={400}>
        Anytime you instantiate a transaction, always make sure that you are
        interacting with the right contract, calling the right method with the
        right data.
      </Text>
      <Text textAlign="left" fontWeight={400}>
        We strongly recommend that you conduct your own research and consider
        the risks involved before proceeding with the wrapping process. Your use
        of our services is at your sole risk.
      </Text>
    </VStack>
  );
}
