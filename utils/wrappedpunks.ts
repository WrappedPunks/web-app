import { NETWORK, WRAPPED_PUNKS_IMAGE_HOST } from "@/configs/env";

export const getWrappedPunkImageUrl = (punkId: number) => {
  if (NETWORK === "testnet") {
    return `${WRAPPED_PUNKS_IMAGE_HOST}/images/punks/1785.png`; // TODO: change back to use punkId
  }
  return `${WRAPPED_PUNKS_IMAGE_HOST}/images/punks/${punkId}.png`;
};
