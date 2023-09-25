import { pxToRem } from "@/configs/theme";
import { useCryptoPunks } from "@/features/nft.hooks";
import { getCryptoPunkImage } from "@/features/nft.utls";
import {
  filterAtom,
  useAvailableFilterGroups,
  useFilteredCryptoPunks,
} from "@/features/punks-filter.hooks";
import { TFilter } from "@/features/punks-filter.types";
import { createDummyArray } from "@/utils/array";
import { FilterFilled, FilterOutlined } from "@ant-design/icons";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Flex,
  Grid,
  GridItem,
  GridProps,
  Icon,
  Image,
  Skeleton,
  Stack,
  Text,
  forwardRef,
  useBoolean,
} from "@chakra-ui/react";
import { CreatableSelect, Select } from "chakra-react-select";
import { useAtom } from "jotai";
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
    {...props}
  />
));

const CryptopunksList = () => {
  const [isFilterOpen, filterControl] = useBoolean(false);
  const [filter, setFilter] = useAtom(filterAtom);

  const availableGroups = useAvailableFilterGroups();

  const { isLoading } = useCryptoPunks();
  const displayList = useFilteredCryptoPunks();

  const numberOfFilters = useMemo(() => {
    return Object.keys(filter).filter(
      (key) => filter[key as keyof TFilter].length > 0
    ).length;
  }, [filter]);

  return (
    <Flex w="full" flexDirection="column">
      <Button
        variant="outline"
        colorScheme="black"
        w={{ base: "full", md: "16ch" }}
        onClick={filterControl.toggle}
        size={{ base: "sm", md: "md" }}
        justifyContent="flex-start"
        _active={{
          bgColor: "blackAlpha.200",
        }}
      >
        <Icon as={numberOfFilters > 0 ? FilterFilled : FilterOutlined} />
        <Text as="span" flex={1} px={1} textAlign="left">
          Filter{numberOfFilters > 0 ? ` (${numberOfFilters})` : ""}
        </Text>
        <Icon
          as={isFilterOpen ? ChevronUpIcon : ChevronDownIcon}
          fontSize="xl"
        />
      </Button>
      <Collapse
        in={isFilterOpen}
        animateOpacity
        style={{ overflow: "visible" }}
      >
        <Stack
          px={{ base: 4, md: 6 }}
          pt={3}
          pb={{ base: 3, md: 5 }}
          mt={{
            base: 2,
            lg: 4,
          }}
          borderRadius="lg"
          shadow="md"
          spacing={3}
        >
          <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
            Includes
          </Text>
          {availableGroups.type && (
            <Select
              placeholder="Type"
              instanceId="filter--type"
              colorScheme="primary"
              useBasicStyles
              focusBorderColor="primary.500"
              options={availableGroups.type}
              value={filter.types}
              onChange={(types) =>
                setFilter((current) => ({ ...current, types }))
              }
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              isMulti
              isSearchable
              size={{ base: "sm", md: "md" }}
            />
          )}
          {availableGroups.trait && (
            <Select
              placeholder="Trait"
              instanceId="filter--trait"
              colorScheme="primary"
              useBasicStyles
              focusBorderColor="primary.500"
              options={availableGroups.trait}
              value={filter.traits}
              onChange={(traits) =>
                setFilter((current) => ({ ...current, traits }))
              }
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              isMulti
              isSearchable
              size={{ base: "sm", md: "md" }}
            />
          )}
          <CreatableSelect
            placeholder="Punk ID"
            instanceId="filter--punk-id"
            colorScheme="primary"
            useBasicStyles
            focusBorderColor="primary.500"
            options={[]}
            noOptionsMessage={() => (
              <Text textAlign="left" px={4}>
                Add Punk ID here to filter
              </Text>
            )}
            value={filter.punkIds}
            onChange={(punkIds) =>
              setFilter((current) => ({ ...current, punkIds }))
            }
            isMulti
            isSearchable
            formatCreateLabel={(inputValue) => (
              <Text as="span" color="blackAlpha.600">
                Add{" "}
                <Text as="span" fontWeight="bold" color="blackAlpha.900">
                  #{inputValue}
                </Text>{" "}
                to filter
              </Text>
            )}
            components={{
              DropdownIndicator: null,
            }}
            size={{ base: "sm", md: "md" }}
          />
          <Text
            pt={2}
            fontWeight="semibold"
            fontSize={{ base: "sm", md: "md" }}
          >
            Excludes
          </Text>
          <Select
            placeholder="Type"
            instanceId="filter--excluded-type"
            colorScheme="primary"
            useBasicStyles
            focusBorderColor="primary.500"
            options={availableGroups.type}
            value={filter.excludedTypes}
            onChange={(excludedTypes) =>
              setFilter((current) => ({
                ...current,
                excludedTypes,
              }))
            }
            getOptionLabel={(opt) => opt.label}
            getOptionValue={(opt) => opt.value}
            isMulti
            isSearchable
            size={{ base: "sm", md: "md" }}
          />
          <Select
            placeholder="Trait"
            instanceId="filter--excluded-trait"
            colorScheme="primary"
            useBasicStyles
            focusBorderColor="primary.500"
            options={availableGroups.trait}
            value={filter.excludedTraits}
            onChange={(excludedTraits) =>
              setFilter((current) => ({
                ...current,
                excludedTraits,
              }))
            }
            getOptionLabel={(opt) => opt.label}
            getOptionValue={(opt) => opt.value}
            isMulti
            isSearchable
            size={{ base: "sm", md: "md" }}
          />
        </Stack>
      </Collapse>

      <Stack
        spacing={{
          base: 4,
          lg: 6,
        }}
        pt={{
          base: 4,
          lg: 6,
        }}
      >
        {isLoading ? (
          <>
            <Skeleton w="10ch" h={pxToRem(30)} />
            {createDummyArray(5).map((value) => (
              <Skeleton key={value} w="full" h={pxToRem(128)} />
            ))}
          </>
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold">
              {displayList.length} Punks
            </Text>
            <VirtuosoGrid
              useWindowScroll
              totalCount={displayList.length}
              overscan={500}
              components={{
                Item: GridItem,
                List: GridContainer,
              }}
              itemContent={(index) => {
                const tokenId = displayList[index].id;
                return (
                  <Box
                    key={tokenId}
                    as={Link}
                    href={`/punk/${tokenId}`}
                    transition="opacity 0.3s ease"
                    _hover={{
                      opacity: 0.8,
                    }}
                  >
                    <Box
                      pos="relative"
                      aspectRatio={1}
                      w="full"
                      bgColor="cryptopunksBg"
                      position="relative"
                    >
                      <Image
                        alt={`punk #${tokenId}`}
                        src={getCryptoPunkImage(displayList[index].id)}
                      />
                    </Box>
                    <Text
                      fontWeight="bold"
                      textAlign="center"
                      fontSize={{
                        base: "sm",
                        lg: "md",
                      }}
                    >
                      #{tokenId}
                    </Text>
                  </Box>
                );
              }}
            />
          </>
        )}
      </Stack>
    </Flex>
  );
};

export default CryptopunksList;
