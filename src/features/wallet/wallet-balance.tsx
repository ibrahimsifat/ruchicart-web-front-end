import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CurrencyIcon as Exchange, Plus, Wallet } from "lucide-react";

interface WalletBalanceProps {
  balance: number;
  onAddFunds: () => void;
  onTransferPoints: () => void;
}

export function WalletBalance({
  balance,
  onAddFunds,
  onTransferPoints,
}: WalletBalanceProps) {
  return (
    <Card className="bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-medium opacity-90">Wallet Balance</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">${balance.toFixed(2)}</span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm opacity-75"
              >
                Available Balance
              </motion.span>
            </div>
          </div>
          <Wallet className="h-12 w-12 opacity-50" />
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={onAddFunds}
            variant="secondary"
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
          <Button
            onClick={onTransferPoints}
            variant="secondary"
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <Exchange className="h-4 w-4 mr-2" />
            Transfer Points
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
