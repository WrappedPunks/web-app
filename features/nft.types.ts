export interface TNftAttributes {
  value: string;
  trait_type: string;
}

export interface TNftAttributesMinimal {
  v: string;
  t: string;
}

export interface PunkDetailsMinimalResponse {
  attributes: TNftAttributesMinimal[];
  owner: `0x${string}`;
  id: number;
  imageUrl: string;
  isWrapped?: boolean;
  error?: string;
}

export interface PunkDetails
  extends Omit<PunkDetailsMinimalResponse, "attributes"> {
  attributes: TNftAttributes[];
}

export type TSimpleNft = Omit<PunkDetails, "owner" | "imageUrl" | "isWrapped">;
