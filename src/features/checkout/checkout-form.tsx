import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAddressManager } from "@/lib/hooks/checkout/useAddressManager";
import { usePaymentHandler } from "@/lib/hooks/checkout/usePaymentHandler";
import { formSchema } from "@/lib/utils/schema";
import { useBranchStore } from "@/store/branchStore";
import { useCart } from "@/store/cartStore";
import { BaseBranch } from "@/types/branch";
import { DeliverySection } from "./DeliverySection";
import { OrderTypeSelector } from "./OrderTypeSelector";
import TakeAwayOrderSection from "./takeAwayOrderSection";

interface CheckoutFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  deliveryTip: number;
  setDeliveryTip: React.Dispatch<React.SetStateAction<number>>;
  setIsCashOnDelivery: React.Dispatch<React.SetStateAction<boolean>>;
  isGuestCheckout?: boolean;
}

export const CheckoutForm = React.memo(
  ({
    onSubmit,
    isLoading,
    deliveryTip,
    setDeliveryTip,
    setIsCashOnDelivery,
    isGuestCheckout = false,
  }: CheckoutFormProps) => {
    const t = useTranslations("checkout");
    const { toast } = useToast();
    const { currentBranch: branch } = useBranchStore();
    const { total } = useCart();

    // Initialize form with default values
    const defaultValues = useMemo(
      () => ({
        order_amount: total,
        delivery_address_id: 0,
        payment_method: "",
        order_type: "delivery" as "delivery" | "take_away",
        branch_id: branch?.id,
        delivery_time: "now",
        delivery_date: new Date().toISOString().slice(0, 10),
        distance: 0,
        is_partial: 0,
        delivery_tip: deliveryTip,
      }),
      [total, branch?.id, deliveryTip]
    );

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues,
    });

    // Custom hooks for managing addresses and payments
    const addressManager = useAddressManager();
    const paymentHandler = usePaymentHandler({
      form,
      onSubmit,
      setIsCashOnDelivery,
    });

    // Watch form values
    const orderType = form.watch("order_type");
    const paymentMethod = form.watch("payment_method");

    // Handle cash on delivery updates
    useEffect(() => {
      setIsCashOnDelivery(form.watch("payment_method") === "cash_on_delivery");
    }, [form.watch("payment_method"), setIsCashOnDelivery]);

    const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        if (
          values.payment_method === "stripe" &&
          !values.stripe_payment_intent_id
        ) {
          toast({
            title: "Payment Error",
            description:
              "Please complete the Stripe payment before submitting the order.",
            variant: "destructive",
          });
          return;
        }
        await onSubmit(values);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit order. Please try again.",
          variant: "destructive",
        });
      }
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t("orderDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <OrderTypeSelector control={form.control} t={t} />

              {orderType === "delivery" ? (
                <DeliverySection
                  form={form}
                  addressManager={addressManager}
                  paymentHandler={paymentHandler}
                  deliveryTip={deliveryTip}
                  setDeliveryTip={setDeliveryTip}
                  isLoading={isLoading}
                  paymentMethod={paymentMethod}
                  isGuestCheckout={isGuestCheckout}
                  t={t}
                />
              ) : (
                <TakeAwayOrderSection
                  branch={branch as BaseBranch}
                  onSubmit={paymentHandler.handleTakeAwaySubmit}
                  isLoading={isLoading}
                  t={t}
                />
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  }
);

CheckoutForm.displayName = "CheckoutForm";
