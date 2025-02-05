import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CONSTANT } from "@/config/constants";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, DollarSign } from "lucide-react";
import { StripePaymentForm } from "./stripe-payment-form";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentMethodsProps {
  value: string;
  onChange: (value: string) => void;
  onStripePaymentSuccess: (paymentIntentId: string) => void;
  onCashOnDeliverySubmit: () => void;
}

export function PaymentMethods({
  value,
  onChange,
  onStripePaymentSuccess,
  onCashOnDeliverySubmit,
}: PaymentMethodsProps) {
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
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={handlePaymentMethodChange}
          className="grid gap-4"
        >
          <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
            <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
            <Label
              htmlFor="cash_on_delivery"
              className="flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="h-4 w-4" />
              Cash on Delivery
              <small className="text-muted-foreground">
                An additional amount of {CONSTANT.cashOnDeliveryChangeAmount}{" "}
                will be charged for Cash on Delivery.
              </small>
            </Label>
          </div>
          <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label
              htmlFor="stripe"
              className="flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              Credit Card (Stripe)
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
            {/* <div className="text-sm text-muted-foreground">
              An additional amount of {CONSTANT.cashOnDeliveryChangeAmount} will
              be charged for Cash on Delivery.
            </div> */}
            {/* <Input
              type="number"
              placeholder="Change amount (optional)"
              value={changeAmount}
              onChange={(e) => setChangeAmount(e.target.value)}
            /> */}
            <button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded"
              onClick={handleCashOnDeliverySubmit}
            >
              Confirm Cash on Delivery
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
