"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CONSTANT } from "@/config/constants";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Coins, CreditCard, DollarSign, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { StripePaymentForm } from "./stripePaymentForm";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentMethodsProps {
  value: string;
  onChange: (value: string) => void;
  onStripePaymentSuccess: (paymentIntentId: string) => void;
  onCashOnDeliverySubmit: () => void;
  walletBalance?: number;
  isGuestCheckout?: boolean;
}

export function PaymentMethods({
  walletBalance,
  value,
  onChange,
  onStripePaymentSuccess,
  onCashOnDeliverySubmit,
  isGuestCheckout,
}: PaymentMethodsProps) {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const t = useTranslations("checkout");
  const handlePaymentMethodChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleCashOnDeliverySubmit = () => {
    onCashOnDeliverySubmit();
  };
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-text" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={handlePaymentMethodChange}
          className="grid gap-4"
        >
          <div className="relative">
            <RadioGroupItem
              value="cash_on_delivery"
              id="cash_on_delivery"
              className="peer sr-only"
            />
            <Label
              htmlFor="cash_on_delivery"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div className="flex items-center justify-between w-full space-x-5">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Cash on Delivery
                </div>
                <span className="text-muted-foreground">
                  An additional amount of {CONSTANT.cashOnDeliveryChangeAmount}{" "}
                  will be charged for Cash on Delivery.
                </span>
              </div>
            </Label>
          </div>
          {!isGuestCheckout && walletBalance && (
            <div className="relative">
              <RadioGroupItem
                value="wallet"
                id="wallet"
                className="peer sr-only"
              />
              <Label
                htmlFor="wallet"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex items-center justify-between w-full space-x-5">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </div>
                  <span className="text-muted-foreground">
                    Available Balance:{" "}
                    <span className="font-bold text-primary">
                      {walletBalance}
                    </span>
                  </span>
                </div>
              </Label>
            </div>
          )}

          <div className="relative">
            <RadioGroupItem
              value="stripe"
              id="stripe"
              className="peer sr-only"
            />
            <Label
              htmlFor="stripe"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 px-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div className="flex items-center justify-between w-full space-x-5">
                <div className="flex items-center gap-2">
                  <Image
                    src={CONSTANT.images.visaMasterLogo}
                    alt="Visa"
                    width={30}
                    height={15}
                  />
                  <Image
                    src={CONSTANT.images.masterCardLogo}
                    alt="MasterCard"
                    width={30}
                    height={15}
                  />
                </div>
                <span className="text-muted-foreground">Pay with Card</span>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {value === "stripe" && (
          <div className="mt-4">
            <Elements stripe={stripePromise}>
              <StripePaymentForm onPaymentSuccess={onStripePaymentSuccess} />
            </Elements>
          </div>
        )}
        {value === "cash_on_delivery" && (
          <div className="mt-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              An additional amount of {CONSTANT.cashOnDeliveryChangeAmount} will
              be charged for Cash on Delivery.
            </div>
            <>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked as boolean)
                  }
                />
                <label htmlFor="terms" className="text-sm leading-none">
                  {t("iAgreeThatPlacingTheOrderPlacesMeUnder")}{" "}
                  <Button variant="link" className="h-auto p-0">
                    {t("termsAndConditions")}
                  </Button>{" "}
                  &
                  <Button variant="link" className="h-auto p-0">
                    {t("privacyPolicy")}
                  </Button>
                </label>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleCashOnDeliverySubmit();
                }}
                className="w-full"
                disabled={!acceptTerms}
              >
                <Coins className="mr-2 h-4 w-4" />
                Confirm Cash on Delivery
              </Button>
            </>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
