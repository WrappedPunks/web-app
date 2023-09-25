import PunkDetails from "@/components/_punk/punk-details";
import PunkHistory from "@/components/_punk/punk-history";
import UnwrappingModal from "@/components/_punk/unwrapping-modal/unwrapping-modal";
import WrappingModal from "@/components/_punk/wrapping-modal/wrapping-modal";
import { usePunkByTokenId } from "@/features/nft.hooks";
import { getPunkType } from "@/features/nft.utls";
import { usePreferImpersonatedAccount } from "@/features/user.hooks";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, HStack, Spinner, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect } from "react";

interface PunkDetailPageProps {
  tokenId: number;
}

export const getServerSideProps: GetServerSideProps<
  PunkDetailPageProps
> = async ({ query }) => {
  try {
    const tokenId = query.tokenId;

    if (!tokenId || typeof tokenId !== "string") {
      throw new Error("punkType/tokenId is missing or invalid");
    }

    const tokenIdNumber = parseInt(tokenId);

    return {
      props: {
        tokenId: tokenIdNumber,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

const PunkDetailPage = ({ tokenId }: PunkDetailPageProps) => {
  const qc = useQueryClient();
  const { data: punk, isSuccess, isLoading } = usePunkByTokenId(tokenId);

  const { isConnected } = usePreferImpersonatedAccount();

  useEffect(() => {
    if (isSuccess && punk && getPunkType(punk) === "cryptopunks") {
      qc.setQueryData(["cryptoPunk", tokenId], () => punk);
    }
  }, [isSuccess, punk, qc, tokenId]);

  const punkType = punk ? getPunkType(punk) : null;

  return (
    <Flex flexDir="column">
      {isLoading && (
        <Center>
          <Spinner color="primary.500" size="lg" thickness="4px" />
        </Center>
      )}
      {punk && isConnected && (
        <Box my={5} w="fit-content">
          <Link
            href={{
              pathname: "/my-punks",
              query: {
                type:
                  punkType === "wrappedpunks"
                    ? "wrapped-punks"
                    : "crypto-punks",
              },
            }}
          >
            <HStack color="gray.400" fontSize="sm" fontWeight={700}>
              <ArrowBackIcon fontSize="lg" />
              <Text>
                My {punkType === "cryptopunks" ? "CryptoPunks" : "WrappedPunks"}
              </Text>
            </HStack>
          </Link>
        </Box>
      )}
      <PunkDetails punk={punk} />
      <Box mt={20}>
        {punkType === "cryptopunks" && <WrappingModal punkId={tokenId} />}
        {punkType === "wrappedpunks" && <UnwrappingModal punkId={tokenId} />}
      </Box>
      {!!punk && punkType === "wrappedpunks" && (
        <Box mt={{ base: 10, lg: 12 }}>
          <PunkHistory punk={punk} />
        </Box>
      )}
    </Flex>
  );
};

export default PunkDetailPage;
