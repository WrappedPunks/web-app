import { IS_CONNECTION_DISABLED } from "@/configs/env";
import { NULL_ADDRESS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  decodeAbiParameters,
  isAddress,
  isAddressEqual,
  parseAbiParameters,
} from "viem";
import { useAccount } from "wagmi";
import { getUserProxyWallet } from "./user.services";

/**
 * Impersonate a specific wallet, view only
 */
export const usePreferImpersonatedAccount = () => {
  const [impersonatedAddress] = useState(() => {
    if (typeof window === "undefined") return null;
    const impacc = localStorage.getItem("impacc");
    if (impacc && isAddress(impacc)) {
      return impacc;
    }
    localStorage.removeItem("impacc");
    return null;
  });

  const account = useAccount();

  const impersonatedAccount = useMemo(() => {
    if (!impersonatedAddress) {
      return {
        address: undefined,
        connector: null,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status: "disconnected",
      };
    }
    return {
      address: impersonatedAddress,
      connector: {
        id: "impersonate",
        name: "Impersonate",
        disconnect() {
          localStorage.removeItem("impacc");
          window.location.reload();
        },
      },
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      status: "connected",
    };
  }, [impersonatedAddress]);

  if (IS_CONNECTION_DISABLED) {
    return {
      address: undefined,
      connector: null,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      isReconnecting: false,
      status: "disconnected",
    };
  }

  return impersonatedAddress ? impersonatedAccount : account;
};

export const useUserProxyWallet = (address: string) => {
  return useQuery({
    queryKey: ["userProxyWallet", address],
    queryFn: () => getUserProxyWallet(address),
    enabled: !!address,
    select(data) {
      const proxyAddress = decodeAbiParameters(
        parseAbiParameters("address"),
        data
      )[0];

      // return Null if proxyAddress is the null address
      if (isAddressEqual(proxyAddress, NULL_ADDRESS)) {
        return null;
      }

      return proxyAddress;
    },
  });
};
