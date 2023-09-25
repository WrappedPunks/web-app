import { isAddress } from "viem";

const impersonatedAddressKey = "impacc";

export const getImpersonatedAddress = () => {
  if (typeof window === "undefined") return null;
  const impacc = localStorage.getItem(impersonatedAddressKey);
  if (impacc && isAddress(impacc)) {
    return impacc;
  }
  localStorage.removeItem(impersonatedAddressKey);
  return null;
};

export const setImpersonatedAddress = (address?: string) => {
  if (typeof window === "undefined") return;
  if (!address) {
    localStorage.removeItem(impersonatedAddressKey);
  } else if (isAddress(address)) {
    localStorage.setItem(impersonatedAddressKey, address);
  }
};
