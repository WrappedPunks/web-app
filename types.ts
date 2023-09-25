import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

export type TEnvironment = "production" | "development";

export type TNetworkType = "mainnet" | "testnet";

export type TPunkType = "cryptopunks" | "wrappedpunks";

/**
 * Default API response without any data
 */
export interface DefaultRequestResponse {
  success: boolean;
}

export interface BaseRequestResponse<Data = any> {
  result: Data;
  statusCode: number;
}

export interface BaseErrorResponse<R = any> {
  error?: string;
  statusCode: number;
  message: string | string[];
  data?: R;
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement<P>) => ReactNode;
};
