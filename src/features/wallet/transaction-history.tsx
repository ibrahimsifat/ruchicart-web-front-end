"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WalletTransaction } from "@/types/wallet";
import { format } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  Gift,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

interface TransactionHistoryProps {
  transactions: WalletTransaction[];
  onFilterChange: (type: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function TransactionHistory({
  transactions,
  onFilterChange,
  onLoadMore,
  hasMore,
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "add_fund":
      case "add_fund_by_admin":
      case "add_fund_bonus":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "order_place":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Gift className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select onValueChange={onFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="add_fund">Added Funds</SelectItem>
                <SelectItem value="add_fund_bonus">Bonus</SelectItem>
                <SelectItem value="order_place">Order Payment</SelectItem>
                <SelectItem value="loyalty_point_to_wallet">
                  Points Transfer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">
                  Reference
                </TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.transaction_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.transaction_type)}
                      <span className="text-sm capitalize">
                        {transaction.transaction_type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.transaction_id}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        transaction.credit > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {transaction.credit > 0 ? "+" : "-"}$
                      {(transaction.credit || transaction.debit).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.reference}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(new Date(transaction.created_at), "PP")}
                  </TableCell>
                  <TableCell className="text-right">
                    ${transaction.balance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {hasMore && (
          <div className="mt-4 text-center">
            <Button onClick={onLoadMore}>Load More</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
