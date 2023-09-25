import { API_HOST } from "@/configs/env";
import { getData } from "@/configs/fetch";
import { TxConfirmationResponse } from "./tx-watcher.types";

export const getIsTxConfirmed = async (
  txHash?: string,
  signal?: AbortSignal
): Promise<TxConfirmationResponse> => {
  if (!txHash) {
    return {
      status: 0,
    };
  }
  return await getData<TxConfirmationResponse>(
    `${API_HOST}/api/tx/is-confirmed/${txHash}`,
    {
      signal,
    }
  );
};
