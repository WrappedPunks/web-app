import { Button, Center, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Center h="60dvh" flexDirection="column" gap={8}>
      <Text
        fontSize={{
          base: "xl",
          lg: "2xl",
        }}
        fontWeight="semibold"
        color="blackAlpha.700"
        textAlign="center"
      >
        Oops! Page not found
      </Text>
      <Button
        colorScheme="primary"
        px={{ base: 4, lg: 8 }}
        as={Link}
        href="/"
        replace
      >
        Go to Home
      </Button>
    </Center>
  );
}
