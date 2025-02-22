import { api } from "@/lib/api/api";
import { TransactionResponse, WalletBonus } from "@/types/wallet";

export async function getWalletTransactions(params: {
  limit: number;
  offset: number;
  transaction_type?: string;
}): Promise<TransactionResponse> {
  const { data } = await api.get("/customer/wallet-transactions", { params });
  return data;
}

export async function getWalletBonuses(): Promise<WalletBonus[]> {
  const { data } = await api.get("/customer/bonus/list");
  return data;
}

export async function transferPointsToWallet(point: number) {
  const { data } = await api.post("/customer/transfer-point-to-wallet", {
    point,
  });
  return data;
}

export async function addFundsToWallet(
  amount: number,
  paymentMethodId: string,
  customerId: string
) {
  const { data } = await api.post("/customer/add-wallet-fund", {
    customer_id: customerId,
    amount,
    reference: paymentMethodId,
    transaction_type: "add_fund",
  });
  return data;
}
