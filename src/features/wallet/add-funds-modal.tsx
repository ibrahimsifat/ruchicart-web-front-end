"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { WalletBonus } from "@/types/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
});

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
  bonuses: WalletBonus[];
}

export function AddFundsModal({ open, onClose, bonuses }: AddFundsModalProps) {
  const { toast } = useToast();
  const [eligibleBonus, setEligibleBonus] = useState<WalletBonus | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const handleAmountChange = (value: string) => {
    form.setValue("amount", value);
    const numAmount = Number(value);

    const eligible = bonuses.find(
      (bonus) =>
        numAmount >= bonus.minimum_add_amount &&
        new Date(bonus.end_date) > new Date()
    );
    setEligibleBonus(eligible || null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Since we don't have a direct add funds API, we'll show a message to the user

    toast({
      title: "Add Funds",
      description: `Please contact support to add $${values.amount} to your wallet.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      type="number"
                      {...field}
                      onChange={(e) => handleAmountChange(e.target.value)}
                    />
                  </FormControl>
                  {eligibleBonus && (
                    <p className="text-sm text-green-600">
                      You'll get ${eligibleBonus.bonus_amount} bonus on this
                      amount!
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Available Bonuses</h4>
              <div className="space-y-2">
                {bonuses.map((bonus) => (
                  <div key={bonus.id} className="text-sm">
                    <p>
                      Add ${bonus.minimum_add_amount} get ${bonus.bonus_amount}{" "}
                      bonus
                    </p>
                    <p className="text-muted-foreground">
                      Valid till {new Date(bonus.end_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Request Add Funds
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
