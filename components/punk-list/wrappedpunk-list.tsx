import { useWrappedPunks } from "@/features/nft.hooks";
import { PunkDetails } from "@/features/nft.types";
import { getWrappedPunkImageUrl } from "@/utils/wrappedpunks";
import {
  Box,
  Image as ChakraImage,
  Grid,
  GridItem,
  GridProps,
  Skeleton,
  Text,
  forwardRef,
  useUnmountEffect,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";
import { VirtuosoGrid } from "react-virtuoso";

const GridContainer = forwardRef((props: GridProps, ref) => (
  <Grid
    ref={ref}
    templateColumns={{
      base: "repeat(4, 1fr)",
      sm: "repeat(6, 1fr)",
      md: "repeat(8, 1fr)",
      lg: "repeat(12, 1fr)",
    }}
    rowGap={{
      base: 2,
      md: 4,
    }}
    columnGap={0.5}
    {...props}
  />
));

const WrappedPunkList = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useWrappedPunks();

  const list = useMemo(() => data || [], [data]);

  useUnmountEffect(() => {
    qc.setQueryData<PunkDetails[]>(["wrappedPunks"], (currentData) => {
      if (!currentData) return currentData;
      return currentData;
    });
  });

  return (
    <Box w="full">
      <Text
        fontWeight="bold"
        mt={{ base: 12, md: 14, lg: 16 }}
        pb={{
          base: 4,
          lg: 6,
        }}
        fontSize="lg"
      >
        There are{" "}
        <Text as="b" color="primary.500">
          {isLoading ? "-" : data?.length}
        </Text>{" "}
        Punks Currently Wrapped
      </Text>
      <VirtuosoGrid
        useWindowScroll
        totalCount={isLoading ? 24 : list.length}
        overscan={500}
        components={{
          Item: GridItem,
          List: GridContainer,
        }}
        itemContent={(index) =>
          isLoading ? (
            <Box key={`skeleton-${index}`}>
              <Skeleton w="full" aspectRatio={1} />
            </Box>
          ) : (
            <Box
              key={list[index].id}
              as={Link}
              href={`/punk/${list[index].id}`}
              transition="opacity 0.3s ease"
              _hover={{
                opacity: 0.8,
              }}
            >
              <Box pos="relative" aspectRatio={1} w="full">
                <ChakraImage
                  alt={`WrappedPunk #${list[index].id}`}
                  src={getWrappedPunkImageUrl(list[index].id)}
                />
              </Box>
              <Text
                fontWeight="bold"
                textAlign="center"
                fontSize={{
                  base: "sm",
                  lg: "md",
                }}
                color="primary.500"
              >
                #{list[index].id}
              </Text>
            </Box>
          )
        }
      />
    </Box>
  );
};

export default WrappedPunkList;
