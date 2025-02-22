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
import { addFundsToWallet } from "@/lib/api/wallet";
import { useAuthStore } from "@/store/authStore";
import type { WalletBonus } from "@/types/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { WalletStripePaymentForm } from "../dashboard/walletStripePaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
});

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
  bonuses: WalletBonus[];
  onSuccess: () => void;
}

export function AddFundsModal({
  open,
  onClose,
  bonuses,
  onSuccess,
}: AddFundsModalProps) {
  const { toast } = useToast();
  const [eligibleBonus, setEligibleBonus] = useState<WalletBonus | null>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const { user } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const handleAmountChange = (value: string) => {
    form.setValue("amount", value);
    const numAmount = Number(value);
    setAmount(numAmount);

    const eligible = bonuses.find(
      (bonus) =>
        numAmount >= bonus.minimum_add_amount &&
        new Date(bonus.end_date) > new Date()
    );
    setEligibleBonus(eligible || null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setShowStripeForm(true);
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    try {
      if (!user?.id) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
      }
      if (user?.id) {
        await addFundsToWallet(amount, paymentMethodId, user?.id.toString());
        console.log("success");
        toast({
          title: "Success",
          description: `$${amount} has been added to your wallet.`,
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ... rest of the component remains unchanged

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
        </DialogHeader>
        {!showStripeForm ? (
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
                        Add ${bonus.minimum_add_amount} get $
                        {bonus.bonus_amount} bonus
                      </p>
                      <p className="text-muted-foreground">
                        Valid till{" "}
                        {new Date(bonus.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </form>
          </Form>
        ) : (
          <Elements stripe={stripePromise}>
            <WalletStripePaymentForm
              amount={amount}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
