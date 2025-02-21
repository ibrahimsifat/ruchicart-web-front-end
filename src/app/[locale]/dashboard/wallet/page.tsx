"use client";

import { AddFundsModal } from "@/features/wallet/add-funds-modal";
import { TransactionHistory } from "@/features/wallet/transaction-history";
import { TransferPointsModal } from "@/features/wallet/transfer-points-modal";
import { WalletBalance } from "@/features/wallet/wallet-balance";
import { WalletBonusCards } from "@/features/wallet/wallet-bonus-cards";
import { getWalletBonuses, getWalletTransactions } from "@/lib/api/wallet";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

export default function WalletPage() {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showTransferPoints, setShowTransferPoints] = useState(false);
  const [transactionType, setTransactionType] = useState<string>("");

  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryKey: ["wallet-transactions", transactionType],
    queryFn: () =>
      getWalletTransactions({
        limit: 10,
        offset: 0,
        transaction_type: transactionType,
      }),
  });

  const { data: bonuses } = useQuery({
    queryKey: ["wallet-bonuses"],
    queryFn: getWalletBonuses,
  });

  const handleTransferPointsSuccess = () => {
    refetchTransactions();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8"
      >
        <WalletBalance
          balance={transactions?.data[0]?.balance || 0}
          onAddFunds={() => setShowAddFunds(true)}
          onTransferPoints={() => setShowTransferPoints(true)}
        />

        <WalletBonusCards bonuses={bonuses || []} />

        <TransactionHistory
          transactions={transactions?.data || []}
          onFilterChange={setTransactionType}
        />
      </motion.div>

      <AddFundsModal
        open={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        bonuses={bonuses || []}
      />

      <TransferPointsModal
        open={showTransferPoints}
        onClose={() => setShowTransferPoints(false)}
        currentPoints={100} // You need to fetch this value from the backend
        onSuccess={handleTransferPointsSuccess}
      />
    </div>
  );
}
