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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  points: z.string().min(1, "Points are required"),
});

interface TransferPointsModalProps {
  open: boolean;
  onClose: () => void;
  currentPoints: number;
  onSuccess: () => void;
}

export function TransferPointsModal({
  open,
  onClose,
  currentPoints,
  onSuccess,
}: TransferPointsModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await transferPointsToWallet(Number(values.points));
      toast({
        title: "Success",
        description: `${values.points} points transferred to your wallet.`,
      });
      onClose();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                  <FormLabel>Points to Transfer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter points"
                      type="number"
                      {...field}
                      max={currentPoints}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Available points: {currentPoints}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Transferring..." : "Transfer Points"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
