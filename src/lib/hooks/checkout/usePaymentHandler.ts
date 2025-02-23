import { useWalletTransactions } from "@/lib/hooks/queries/wallet/useWallet";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export const usePaymentHandler = ({
  form,
  onSubmit,
  setIsCashOnDelivery,
}: {
  form: any;
  onSubmit: (data: any) => void;
  setIsCashOnDelivery: (value: boolean) => void;
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [page] = useState(1);
  const { token, getGuestId } = useAuthStore();
  const limit = 10;

  const { data: transactions } = useWalletTransactions("all", page, limit);
  const walletBalance = transactions?.data[0]?.balance || 0;

  const handleStripePaymentSuccess = (paymentIntentId: string) => {
    const orderData = {
      ...form.getValues(),
      payment_method: "stripe",
      stripe_payment_intent_id: paymentIntentId,
      guest_id: !token ? getGuestId() : undefined,
    };
    onSubmit(orderData);
  };

  const handleWalletPaymentSubmit = () => {
    const orderData = {
      ...form.getValues(),
      payment_method: "wallet",
      wallet_amount: walletBalance,
      is_partial: 0,
    };
    onSubmit(orderData);
  };

  const handleCashOnDeliverySubmit = () => {
    const orderData = {
      ...form.getValues(),
      payment_method: "cash_on_delivery",
      is_partial: 0,
    };
    onSubmit(orderData);
  };

  const handleTakeAwaySubmit = () => {
    const orderData = {
      ...form.getValues(),
      order_type: "take_away",
      payment_method: "cash_on_delivery",
      is_partial: 0,
      delivery_address_id: 0,
    };
    onSubmit(orderData);
  };

  return {
    walletBalance,
    acceptTerms,
    setAcceptTerms,
    handleStripePaymentSuccess,
    handleWalletPaymentSubmit,
    handleCashOnDeliverySubmit,
    handleTakeAwaySubmit,
  };
};
