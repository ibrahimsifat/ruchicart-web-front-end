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
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryKey: ["wallet-transactions", transactionType, page],
    queryFn: () =>
      getWalletTransactions({
        limit,
        offset: (page - 1) * limit,
        transaction_type: transactionType || undefined,
      }),
  });

  const { data: bonuses } = useQuery({
    queryKey: ["wallet-bonuses"],
    queryFn: getWalletBonuses,
  });

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSuccess = () => {
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
          onFilterChange={(type) => {
            setTransactionType(type === "all" ? "" : type);
            setPage(1);
          }}
          onLoadMore={handleLoadMore}
          hasMore={(transactions?.total_size || 0) > page * limit}
        />
      </motion.div>

      <AddFundsModal
        open={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        bonuses={bonuses || []}
        onSuccess={handleSuccess}
      />

      <TransferPointsModal
        open={showTransferPoints}
        onClose={() => setShowTransferPoints(false)}
        currentPoints={100} // You need to fetch this value from the backend
        onSuccess={handleSuccess}
      />
    </div>
  );
}
