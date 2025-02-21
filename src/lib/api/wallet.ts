import { api } from "@/lib/api/api";
import type { TransactionResponse, WalletBonus } from "@/types/wallet";

export async function getWalletTransactions(params: {
  limit: number;
  offset: number;
  transaction_type?: string;
}): Promise<TransactionResponse> {
  const { data } = await api.get("/customer/wallet-transactions", { params });
  return data;
}

export async function getWalletBonuses(): Promise<WalletBonus[]> {
  const { data } = await api.get("/customer/wallet-bonus-list");
  return data;
}

export async function transferPointsToWallet(point: number) {
  const { data } = await api.post("/customer/transfer-point-to-wallet", {
    point,
  });
  return data;
}
