import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const t = useTranslations("checkout");

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
      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
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
          handlePayment();
        }}
        className="w-full"
        disabled={!acceptTerms || !stripe || isLoading}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
