import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

interface StripePaymentFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void;
}

export function StripePaymentForm({
  onPaymentSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      if (paymentMethod) {
        toast({
          title: "Card Verified",
          description: "Your card has been verified successfully.",
        });
        onPaymentSuccess(paymentMethod.id);
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description:
          error?.message || "An error occurred while processing your card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true, // Add this if you don't want to collect postal code
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md">
        <CardElement options={cardElementOptions} />
      </div>
      <Button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
