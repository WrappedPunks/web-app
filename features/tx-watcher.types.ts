export interface TxConfirmationResponse {
  status: "confirmed" | "pending" | 0;
  blockNumber?: number;
  error?: string | object;
}
