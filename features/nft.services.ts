import alchemy from "@/configs/alchemy";
import { API_HOST } from "@/configs/env";
import { getData } from "@/configs/fetch";
import { TPunkType } from "@/types";
import { CONTRACT_ADDRESS, NULL_ADDRESS } from "@/utils/constants";
import {
  AssetTransfersCategory,
  AssetTransfersWithMetadataResult,
  SortingOrder,
} from "alchemy-sdk";
import { PunkDetails, PunkDetailsMinimalResponse } from "./nft.types";

export const getWrappedPunks = async (
  signal?: AbortSignal
): Promise<PunkDetails[]> => {
  const response = await getData<PunkDetailsMinimalResponse[]>(
    `${API_HOST}/api/wpunk`,
    { signal }
  );

  return response.map((punk) => ({
    ...punk,
    attributes: punk.attributes.map((attr) => ({
      trait_type: attr.t,
      value: attr.v,
    })),
  }));
};

export const getCryptoPunks = async (
  signal?: AbortSignal
): Promise<PunkDetails[]> => {
  const response = await getData<PunkDetailsMinimalResponse[]>(
    `${API_HOST}/api/punk`,
    { signal }
  );

  return response.map((punk) => ({
    ...punk,
    attributes: punk.attributes.map((attr) => ({
      trait_type: attr.t,
      value: attr.v,
    })),
  }));
};

export const getWrappedPunkByTokenId = async (
  tokenId: number
): Promise<PunkDetails> => {
  try {
    const response = await getData<PunkDetailsMinimalResponse>(
      `${API_HOST}/api/wpunk/${tokenId}`
    );

    return {
      ...response,
      attributes: response.attributes.map((attr) => ({
        trait_type: attr.t,
        value: attr.v,
      })),
    };
  } catch (e) {
    return {
      id: tokenId,
      error: "Not found",
      attributes: [],
      imageUrl: "",
      owner: "0x",
    };
  }
};

export const getCryptoPunkByTokenId = async (
  tokenId: number
): Promise<PunkDetails> => {
  const response = await getData<PunkDetailsMinimalResponse>(
    `${API_HOST}/api/punk/${tokenId}`
  );

  return {
    ...response,
    attributes: response.attributes.map((attr) => ({
      trait_type: attr.t,
      value: attr.v,
    })),
  };
};

export const getPunkByTokenId = async (tokenId: number | null) => {
  if (tokenId === null) {
    throw new Error("Invalid token id");
  }

  let punk = await getWrappedPunkByTokenId(tokenId);

  if (!punk || punk.error || punk.owner === NULL_ADDRESS) {
    punk = await getCryptoPunkByTokenId(tokenId);
  }

  if (!punk || punk.error) {
    throw new Error(punk?.error || "Not found");
  }

  return punk;
};

export const getWrappedPunksForOwner = async (
  owner: `0x${string}`
): Promise<PunkDetails[]> => {
  const response = await getData<PunkDetailsMinimalResponse[]>(
    `${API_HOST}/api/owner/${owner}/wpunk`
  );

  return response.map((punk) => ({
    ...punk,
    attributes: punk.attributes.map((attr) => ({
      trait_type: attr.t,
      value: attr.v,
    })),
  }));
};

export const getCryptoPunksForOwner = async (
  owner: string
): Promise<PunkDetails[]> => {
  const response = await getData<PunkDetailsMinimalResponse[]>(
    `${API_HOST}/api/owner/${owner}/punk`
  );

  return response.map((punk) => ({
    ...punk,
    attributes: punk.attributes.map((attr) => ({
      trait_type: attr.t,
      value: attr.v,
    })),
  }));
};

export const getPunkTransactionHistory = async ({
  tokenId,
  pageKey,
  punkType,
}: {
  tokenId: number;
  pageKey?: string;
  punkType?: TPunkType;
}): Promise<{
  pageKey: string | undefined;
  transfers: AssetTransfersWithMetadataResult[];
}> => {
  const contractAddresses = !punkType
    ? [CONTRACT_ADDRESS.CRYPTO_PUNKS, CONTRACT_ADDRESS.WRAPPED_PUNKS]
    : [
        punkType === "cryptopunks"
          ? CONTRACT_ADDRESS.CRYPTO_PUNKS
          : CONTRACT_ADDRESS.WRAPPED_PUNKS,
      ];

  const response = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    contractAddresses,
    category: [AssetTransfersCategory.ERC721],
    excludeZeroValue: false,
    pageKey,
    withMetadata: true,
    order: SortingOrder.DESCENDING,
  });

  // Get transactions for the NFT
  const filteredTransfers = response.transfers.filter(
    (txn) => txn.erc721TokenId && BigInt(txn.erc721TokenId) === BigInt(tokenId)
  );

  if (filteredTransfers.length === 0 && !!response.pageKey) {
    return await getPunkTransactionHistory({
      tokenId,
      punkType,
      pageKey: response.pageKey,
    });
  }

  return {
    pageKey: response.pageKey,
    transfers: filteredTransfers,
  };
};
