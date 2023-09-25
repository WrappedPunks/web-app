import Disclaimer from "@/components/_about/disclaimer";
import FAQ from "@/components/_about/faq";
import Instructions from "@/components/_about/instructions";
import { pxToRem } from "@/configs/theme";
import { Button, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface AboutTab {
  label: string;
  query: string;
}

const TABS: AboutTab[] = [
  {
    label: "FAQ",
    query: "faq",
  },
  {
    label: "Wrap/Unwrap Instructions",
    query: "instructions",
  },
  {
    label: "Disclaimer",
    query: "disclaimer",
  },
];

export default function About() {
  const { query } = useRouter();

  const selectedTab = useMemo(() => {
    return query.tab ? TABS.findIndex((info) => info.query === query.tab) : 0;
  }, [query]);

  return (
    <Flex flexDir="column" align="center" w="full" h="100%">
      <Grid
        mt={20}
        w="100%"
        maxW="9xl"
        templateColumns={{ base: "1fr", md: `${pxToRem(260)} auto` }}
        gap={{ base: 20, md: 5 }}
        h="100%"
      >
        <GridItem
          h="100%"
          borderRight={{ base: undefined, md: "solid 2px" }}
          borderBottom={{ base: "solid 2px", md: "transparent" }}
          borderColor={{ base: "gray.200", md: "gray.200" }}
          pb={10}
        >
          <VStack alignItems="flex-start" position="sticky">
            {TABS.map((item, index) => (
              <Button
                as={Link}
                variant="text"
                key={item.label}
                color={selectedTab === index ? "primary.500" : undefined}
                w="100%"
                href={{
                  pathname: "/about",
                  query: { tab: item.query },
                }}
                justifyContent={{ base: "center", md: "flex-start" }}
              >
                {item.label}
              </Button>
            ))}
          </VStack>
        </GridItem>
        <GridItem px={5}>
          {selectedTab === 0 && <FAQ />}
          {selectedTab === 1 && <Instructions />}
          {selectedTab === 2 && <Disclaimer />}
        </GridItem>
      </Grid>
    </Flex>
  );
}
