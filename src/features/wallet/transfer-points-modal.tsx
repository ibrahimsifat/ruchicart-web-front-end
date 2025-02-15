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
import { transferPointsToWallet } from "@/lib/api/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  points: z.string().min(1, "Points amount is required"),
});

interface TransferPointsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TransferPointsModal({
  open,
  onClose,
}: TransferPointsModalProps) {
  const { toast } = useToast();
  const [conversionRate] = useState(0.1); // This should come from your backend

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: "",
    },
  });

  const transferMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      transferPointsToWallet(Number(values.points)),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Points transferred successfully to wallet",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to transfer points. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    transferMutation.mutate(values);
  };

  const calculateWalletAmount = (points: string) => {
    const numPoints = Number(points);
    return isNaN(numPoints) ? 0 : numPoints * conversionRate;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Points to Wallet</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter points amount"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    You will receive: ${calculateWalletAmount(field.value)}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Conversion Rate</p>
              <p className="text-sm text-muted-foreground">
                1 point = ${conversionRate.toFixed(2)}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={transferMutation.isPending}
            >
              {transferMutation.isPending ? "Processing..." : "Transfer Points"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
