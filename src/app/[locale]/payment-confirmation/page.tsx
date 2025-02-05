import { useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PaymentConfirmation() {
  const router = useRouter();
  const stripe = useStripe();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          // Payment succeeded, redirect to order confirmation
          router.push(`/order-confirmation/${paymentIntent.id}`);
          break;
        case "processing":
          // Payment still processing, show a loading state
          break;
        case "requires_payment_method":
          // Payment failed, redirect back to checkout
          router.push("/checkout");
          break;
        default:
          // Unknown status, redirect back to checkout
          router.push("/checkout");
          break;
      }
    });
  }, [stripe, router]);

  return <div>Processing payment...</div>;
}
