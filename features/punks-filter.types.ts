import { MultiValue } from "chakra-react-select";

export interface TOption {
  label: string;
  value: string;
}

export interface TFilter {
  types: MultiValue<TOption>;
  // skinTones: MultiValue<TOption>;
  traits: MultiValue<TOption>;
  punkIds: MultiValue<TOption>;
  excludedTypes: MultiValue<TOption>;
  excludedTraits: MultiValue<TOption>;
}
