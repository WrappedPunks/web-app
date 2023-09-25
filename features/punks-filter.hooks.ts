import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { useCryptoPunks } from "./nft.hooks";
import { TFilter, TOption } from "./punks-filter.types";
import {
  TRAITS,
  isExcludedTraits,
  isExcludedTypes,
  isMatchAttributes,
  isMatchPunkIds,
  isMatchTypes,
} from "./punks-filter.utils";

export const filterAtom = atom<TFilter>({
  types: [],
  // skinTones: [],
  traits: [],
  punkIds: [],
  excludedTypes: [],
  excludedTraits: [],
});

export const useAvailableFilterGroups = () =>
  useMemo(() => {
    const groups = TRAITS.reduce<Record<string, TOption[]>>((result, value) => {
      result[value.id] = value.elements.map((el) => ({
        label: el,
        value: el,
      }));
      return result;
    }, {});

    return groups;
  }, []);

export const useFilteredCryptoPunks = () => {
  const { data } = useCryptoPunks();
  const filter = useAtomValue(filterAtom);

  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.filter((item) => {
      return (
        isMatchTypes(item, filter.types) &&
        isMatchAttributes(item, filter.traits) &&
        isMatchPunkIds(item, filter.punkIds) &&
        !isExcludedTypes(item, filter.excludedTypes) &&
        !isExcludedTraits(item, filter.excludedTraits)
      );
    });
  }, [
    data,
    filter.excludedTypes,
    filter.excludedTraits,
    filter.types,
    filter.punkIds,
    filter.traits,
  ]);
};
