export interface WalletTransaction {
  id: number;
  user_id: number;
  transaction_id: string;
  reference: string;
  admin_bonus: number;
  transaction_type:
    | "add_fund"
    | "add_fund_by_admin"
    | "loyalty_point_to_wallet"
    | "order_place"
    | "referral_order_place"
    | "add_fund_bonus";
  debit: number;
  credit: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletBonus {
  id: number;
  bonus_title: string;
  bonus_amount: number;
  minimum_add_amount: number;
  maximum_bonus_amount: number;
  start_date: string;
  end_date: string;
  status: number;
}

export interface TransactionResponse {
  total_size: number;
  limit: number;
  offset: number;
  data: WalletTransaction[];
}
