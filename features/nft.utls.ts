import { NETWORK, S3_HOST } from "@/configs/env";
import { TPunkType } from "@/types";
import { PunkDetails } from "./nft.types";

export const getPunkType = (nft: PunkDetails | null): TPunkType => {
  if (nft && nft.isWrapped === undefined) {
    return "wrappedpunks";
  }
  return "cryptopunks";
};

export const getCryptoPunkImage = (tokenId: number) => {
  if (NETWORK === "testnet") {
    return `${S3_HOST}/data/crypto-punks/1785.svg`; // TODO: change back to use tokenId
  }
  return `${S3_HOST}/data/crypto-punks/${tokenId}.svg`;
};
