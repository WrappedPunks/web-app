import { TWITTER_URL } from "@/utils/constants";
import {
  Link as ChakraLink,
  Flex,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import GeneralContainer from "../general-container";
import CircleTwitter from "../icons/circle-twitter";

export const useFooterHeight = () => {
  return useBreakpointValue({
    base: "4rem",
    lg: "6.25rem",
  });
};

export default function Footer() {
  const height = useFooterHeight();
  return (
    <Flex h={height} w="full" justify="center" bgColor="bgGray" align="center">
      <GeneralContainer display="flex" justifyContent="center">
        <HStack justifyContent="space-between" w="100%">
          <Link
            href={{
              pathname: "/about",
              query: { tab: "disclaimer" },
            }}
          >
            Disclaimer
          </Link>
          <HStack fontSize="2xl" spacing={4} color="gray.600">
            {/* <ChakraLink isExternal href={MEDIUM_URL}>
            <CircleMedium />
          </ChakraLink>
          <ChakraLink isExternal href={`mailto:${CONTACT_EMAIL}`}>
            <CircleMail />
          </ChakraLink>
          <ChakraLink isExternal href={DISCORD_URL}>
            <CircleDiscord />
          </ChakraLink> */}
            <ChakraLink isExternal href={TWITTER_URL}>
              <CircleTwitter />
            </ChakraLink>
          </HStack>
        </HStack>
      </GeneralContainer>
    </Flex>
  );
}
