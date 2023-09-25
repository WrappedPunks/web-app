import { pxToRem } from "@/configs/theme";
import { PunkDetails } from "@/features/nft.types";
import { getCryptoPunkImage, getPunkType } from "@/features/nft.utls";
import {
  getCryptoPunkAccountInfoUrl,
  getCryptoPunkUrl,
} from "@/utils/cryptopunks";
import { shortenString } from "@/utils/string";
import { getWrappedPunkImageUrl } from "@/utils/wrappedpunks";
import {
  Box,
  Center,
  Link as ChakraLink,
  Flex,
  Grid,
  GridItem,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

const PunkBasicInfo = ({ punk }: { punk?: PunkDetails | null }) => {
  if (!punk) {
    return null;
  }

  return <PunkBasicInfoInner punk={punk} />;
};

const PunkBasicInfoInner = ({ punk }: { punk: PunkDetails }) => {
  const punkType = getPunkType(punk);

  const type: string | undefined = punk?.attributes
    ?.find((att) => att.trait_type === "type")
    ?.value.split(" ")[0];

  const attributes: string[] | undefined = punk?.attributes
    ?.filter((att) => att.trait_type === "attribute")
    .map((att) => att.value);

  return (
    <>
      <Center>
        <Box
          w={pxToRem(256)}
          aspectRatio={1}
          borderRadius="sm"
          bgColor={punkType === "cryptopunks" ? "cryptopunksBg" : undefined}
        >
          <Image
            alt="punk-image"
            src={
              punkType === "wrappedpunks"
                ? getWrappedPunkImageUrl(punk.id)
                : getCryptoPunkImage(punk.id)
            }
            w="full"
          />
        </Box>
      </Center>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: `repeat(3, max-content) 1fr`,
        }}
        gap={{ base: 8, lg: 24 }}
        mt={14}
      >
        <GridItem
          pr={{ base: 0, lg: 36 }}
          textAlign={{ base: "center", lg: "left" }}
        >
          <Text
            fontSize={{ base: "2.5rem", lg: "3rem" }}
            fontWeight="bold"
            lineHeight="1em"
          >
            {punkType === "wrappedpunks" ? "W#" : "#"}
            {punk.id}
          </Text>
          <ChakraLink
            isExternal
            href={getCryptoPunkUrl(punk.id)}
            color="blackAlpha.600"
            textDecor="underline"
            fontWeight="normal"
          >
            View in Cryptopunks.app
          </ChakraLink>
        </GridItem>
        <GridItem minW={"14ch"}>
          <Text
            fontWeight="bold"
            color="blackAlpha.600"
            mb={{ base: 2, lg: 4 }}
          >
            Owner
          </Text>
          <Stack spacing={{ base: 1, lg: 3 }}>
            {
              <ChakraLink
                key={punk.owner}
                fontSize={{ base: "lg", lg: "xl" }}
                isExternal
                href={getCryptoPunkAccountInfoUrl(punk.owner)}
                title={punk.owner}
              >
                {shortenString(punk.owner)}
              </ChakraLink>
            }
          </Stack>
        </GridItem>
        <GridItem>
          <Text
            fontWeight="bold"
            color="blackAlpha.600"
            mb={{ base: 2, lg: 4 }}
          >
            Type
          </Text>
          <Text fontSize={{ base: "lg", lg: "xl" }}>{type || "-"}</Text>
        </GridItem>
        <GridItem>
          <Text
            fontWeight="bold"
            color="blackAlpha.600"
            mb={{ base: 2, lg: 4 }}
          >
            Attributes
          </Text>
          <Flex
            fontSize={{ base: "lg", lg: "xl" }}
            flexWrap="wrap"
            columnGap={9}
            rowGap={{ base: 1, lg: 3 }}
          >
            {(!attributes || attributes.length === 0) && "-"}
            {attributes?.map((att) => (
              <Text key={att}>{att}</Text>
            ))}
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};

export default PunkBasicInfo;
