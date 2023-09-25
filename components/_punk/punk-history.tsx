import { usePunkTransactionHistory } from "@/features/nft.hooks";
import { PunkDetails } from "@/features/nft.types";
import { getPunkType } from "@/features/nft.utls";
import { createDummyArray } from "@/utils/array";
import { getEtherscanUrlByTxHash } from "@/utils/etherscan";
import { shortenString } from "@/utils/string";
import {
  Button,
  Link as ChakraLink,
  Hide,
  Show,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { AssetTransfersWithMetadataResult } from "alchemy-sdk";
import format from "date-fns/format";
import { useEffect, useState } from "react";

const PunkHistory = ({ punk }: { punk: PunkDetails }) => {
  const [pageKey, setPageKey] = useState<string>();

  const { data, isLoading, isSuccess } = usePunkTransactionHistory({
    tokenId: punk.id,
    pageKey,
    punkType: getPunkType(punk),
  });

  const [transactions, setTransactions] = useState<
    AssetTransfersWithMetadataResult[]
  >([]);

  useEffect(() => {
    if (isSuccess) {
      setTransactions((currentValue) => [
        ...currentValue,
        ...data.transfers.filter(
          (tx) =>
            !currentValue.some(
              (currentTx) => currentTx.uniqueId === tx.uniqueId
            )
        ),
      ]);
    }
  }, [data, isSuccess]);

  return (
    <>
      <Text fontSize="lg" fontWeight="bold" mb={{ base: 6, lg: 8 }}>
        History
      </Text>
      <TableContainer
        sx={{
          "th, td": {
            px: {
              base: 3,
              md: 6,
              lg: 8,
            },
          },
        }}
      >
        <Table>
          <Thead textTransform="none">
            <Show above="md">
              <Tr bg="bgGray">
                <Th>From</Th>
                <Th>To</Th>
                <Th>Date</Th>
                <Th>Tx</Th>
              </Tr>
            </Show>
            <Hide above="md">
              <Tr bg="bgGray">
                <Th>Details</Th>
                <Th>Tx</Th>
              </Tr>
            </Hide>
          </Thead>
          <Tbody fontSize={{ base: "sm", md: "md" }}>
            {transactions.map((tx) => {
              const date = format(
                new Date(tx.metadata.blockTimestamp),
                "MMMM dd, yyyy"
              );
              return (
                <Tr key={tx.uniqueId}>
                  <Show above="md">
                    <Td>{shortenString(tx.from)}</Td>
                    <Td>{tx.to ? shortenString(tx.to) : "-"}</Td>
                    <Td>{date}</Td>
                    <Td>
                      <ChakraLink
                        isExternal
                        href={getEtherscanUrlByTxHash(tx.hash)}
                        color="blackAlpha.600"
                        fontWeight="normal"
                        textDecor="underline"
                      >
                        View tx
                      </ChakraLink>
                    </Td>
                  </Show>
                  <Hide above="md">
                    <Td>
                      <Stack>
                        <Text>{date}</Text>
                        <Text>From: {shortenString(tx.from)}</Text>
                        {!!tx.to && <Text>To: {shortenString(tx.to)}</Text>}
                      </Stack>
                    </Td>
                    <Td>
                      <ChakraLink
                        isExternal
                        href={getEtherscanUrlByTxHash(tx.hash)}
                        color="blackAlpha.600"
                        fontWeight="normal"
                        textDecor="underline"
                      >
                        View tx
                      </ChakraLink>
                    </Td>
                  </Hide>
                </Tr>
              );
            })}
            {isLoading && <RowsLoadingSkeleton />}
            {!!data?.pageKey && !isLoading && (
              <Tr>
                <Td colSpan={4} textAlign="center" borderColor="transparent">
                  <Button
                    size={{ base: "sm", md: "md" }}
                    onClick={() => setPageKey(data.pageKey)}
                    colorScheme="primary"
                    variant="outline"
                  >
                    Load more
                  </Button>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const RowsLoadingSkeleton = () => {
  return (
    <>
      <Show above="md">
        {createDummyArray(4).map((dummyRow) => (
          <Tr key={`dummy-row-${dummyRow}`}>
            {createDummyArray(4).map((dummyCell) => (
              <Td key={`dummy-cell-${dummyCell}`}>
                <Skeleton w="80%" h={5} />
              </Td>
            ))}
          </Tr>
        ))}
      </Show>
      <Hide above="md">
        {createDummyArray(2).map((dummyRow) => (
          <Tr key={`dummy-row-${dummyRow}`}>
            <Td>
              <Stack>
                <Skeleton w="60%" h={5} />
                <Skeleton w="80%" h={5} />
                <Skeleton w="80%" h={5} />
              </Stack>
            </Td>
            <Td>
              <Skeleton w="60%" h={4} />
            </Td>
          </Tr>
        ))}
      </Hide>
    </>
  );
};

export default PunkHistory;
