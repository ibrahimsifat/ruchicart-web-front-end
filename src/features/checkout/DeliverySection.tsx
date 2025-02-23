import React from "react";
import { PaymentMethods } from "../order/paymentMethods";
import { AddressSection } from "./AddressSection";
import CheckoutAddressForm from "./checkoutAddressForm";
import { DeliveryTips } from "./delivery-tips";
import { LocationDialog } from "./LocationDialog";
import { WalletPaymentSection } from "./WalletPaymentSection";

export const DeliverySection = React.memo(
  ({
    form,
    addressManager,
    paymentHandler,
    deliveryTip,
    setDeliveryTip,
    isLoading,
    paymentMethod,
    t,
    isGuestCheckout,
  }: {
    form: any;
    addressManager: any;
    paymentHandler: any;
    deliveryTip: number;
    setDeliveryTip: (value: number) => void;
    isLoading: boolean;
    paymentMethod: string;
    t: any;
    isGuestCheckout: boolean;
  }) => {
    const {
      addresses,
      addressForm,
      isAddingNewAddress,
      editingAddressId,
      showMap,
      handleAddressSubmit,
      setIsAddingNewAddress,
      setEditingAddressId,
      setShowMap,
      deleteAddressMutation,
      handleEditAddress,
    } = addressManager;

    return (
      <>
        <AddressSection
          addresses={addresses}
          form={form}
          onAddNew={() => {
            setIsAddingNewAddress(true);
            setEditingAddressId(null);
            addressForm.reset();
          }}
          onEdit={handleEditAddress}
          onDelete={deleteAddressMutation.mutateAsync}
          t={t}
        />
        <CheckoutAddressForm
          isAddingNewAddress={isAddingNewAddress}
          editingAddressId={editingAddressId}
          addressForm={addressForm}
          handleAddressSubmit={handleAddressSubmit}
          setIsAddingNewAddress={setIsAddingNewAddress}
          setEditingAddressId={setEditingAddressId}
          setShowMap={setShowMap}
        />
        <DeliveryTips value={deliveryTip} onChange={setDeliveryTip} />
        <PaymentMethods
          walletBalance={paymentHandler.walletBalance}
          value={form.watch("payment_method")}
          onChange={(value) => form.setValue("payment_method", value)}
          onStripePaymentSuccess={paymentHandler.handleStripePaymentSuccess}
          onCashOnDeliverySubmit={paymentHandler.handleCashOnDeliverySubmit}
          isGuestCheckout={isGuestCheckout}
        />
        {!isGuestCheckout && paymentMethod === "wallet" && (
          <WalletPaymentSection
            acceptTerms={paymentHandler.acceptTerms}
            setAcceptTerms={paymentHandler.setAcceptTerms}
            onSubmit={paymentHandler.handleWalletPaymentSubmit}
            isLoading={isLoading}
            t={t}
          />
        )}
        {showMap && (
          <LocationDialog
            open={showMap}
            onOpenChange={setShowMap}
            onSelectLocation={(location) => {
              addressForm.setValue("address", location.address);
              setShowMap(false);
            }}
            t={t}
          />
        )}
      </>
    );
  }
);
