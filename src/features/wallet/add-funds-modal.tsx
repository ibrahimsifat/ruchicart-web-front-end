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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { addFundsToWallet } from "@/lib/api/wallet";
import type { WalletBonus } from "@/types/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  payment_method: z.enum(["stripe", "razorpay", "ssl_commerz"]),
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
      payment_method: "stripe",
    },
  });

  const addFundsMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      addFundsToWallet(Number(values.amount), values.payment_method),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Funds added successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addFundsMutation.mutate(values);
  };

  const handleAmountChange = (amount: string) => {
    form.setValue("amount", amount);
    const numAmount = Number(amount);
    const eligible = bonuses.find(
      (bonus) =>
        numAmount >= bonus.minimum_add_amount &&
        new Date(bonus.end_date) > new Date()
    );
    setEligibleBonus(eligible || null);
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

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4"
                    >
                      <label
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          field.value === "stripe"
                            ? "border-primary bg-primary/5"
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="stripe" id="stripe" />
                          <Image
                            src="/stripe-logo.svg"
                            alt="Stripe"
                            width={60}
                            height={25}
                          />
                        </div>
                      </label>
                      <label
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          field.value === "razorpay"
                            ? "border-primary bg-primary/5"
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem value="razorpay" id="razorpay" />
                          <Image
                            src="/razorpay-logo.svg"
                            alt="Razorpay"
                            width={80}
                            height={25}
                          />
                        </div>
                      </label>
                      <label
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          field.value === "ssl_commerz"
                            ? "border-primary bg-primary/5"
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem
                            value="ssl_commerz"
                            id="ssl_commerz"
                          />
                          <Image
                            src="/ssl-commerz-logo.svg"
                            alt="SSL Commerz"
                            width={80}
                            height={25}
                          />
                        </div>
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={addFundsMutation.isPending}
            >
              {addFundsMutation.isPending ? "Processing..." : "Add Funds"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
