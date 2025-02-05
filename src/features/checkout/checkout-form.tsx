"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  useAddAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/lib/hooks/queries/address/useAddress";
import { useAddressStore } from "@/store/addressStore";
import { useAuthStore } from "@/store/authStore";
import { useBranchStore } from "@/store/branchStore";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import { BaseBranch } from "@/types/branch";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LocationSelector } from "../location/LocationSelector";
import { PaymentMethods } from "../order/payment-methods";
import CheckoutAddress from "./checkoutAddresList";
import CheckoutAddressForm from "./checkoutAddressForm";
import { DeliveryTips } from "./delivery-tips";
import TakeAwayOrderSection from "./takeAwayOrderSection";

const formSchema = z.object({
  order_amount: z.number(),
  payment_method: z.string(),
  order_type: z.enum(["delivery", "take_away"]),
  delivery_address_id: z.number().optional(),
  branch_id: z.string(),
  delivery_time: z.string(),
  delivery_date: z.string(),
  distance: z.number(),
  is_partial: z.number(),
  delivery_tip: z.number().optional(),
  stripe_payment_intent_id: z.string().optional(),
  guest_id: z.union([z.string(), z.number()]).optional(),
  cart: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number(),
      variant: z.array(z.any()),
      add_on_ids: z.array(z.any()),
      add_on_qtys: z.array(z.any()),
    })
  ),
});

const addressSchema = z.object({
  address_type: z.enum(["home", "work", "other"]),
  address: z.string().min(1, "Address is required"),
  road: z.string().min(1, "Road is required"),
  floor: z.string().min(1, "Floor is required"),
  house: z.string().min(1, "House is required"),
  contact_person_name: z.string().min(1, "Contact person name is required"),
  contact_person_number: z.string().min(1, "Phone number is required"),
  is_default: z.boolean().optional(),
});

interface CheckoutFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  deliveryTip: number;
  setDeliveryTip: React.Dispatch<React.SetStateAction<number>>;
  setIsCashOnDelivery: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CheckoutForm({
  onSubmit,
  isLoading,
  deliveryTip,
  setDeliveryTip,
  setIsCashOnDelivery,
}: CheckoutFormProps) {
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const { currentLocation } = useLocationStore();
  const { currentBranch: branch } = useBranchStore();
  const { items, total } = useCart();
  const t = useTranslations("checkout");
  const { token, getGuestId } = useAuthStore();
  const { addresses, addAddress, updateAddress, deleteAddress } =
    useAddressStore();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const [showMap, setShowMap] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_amount: total,
      delivery_address_id: 0,
      payment_method: "",
      order_type: "delivery",
      branch_id: branch.id,
      delivery_time: "now",
      delivery_date: new Date().toISOString().split("T")[0],
      distance: 0,
      is_partial: 0,
      delivery_tip: deliveryTip,
    },
  });
  useEffect(() => {
    if (form.watch("payment_method") === "cash_on_delivery") {
      setIsCashOnDelivery(true);
    } else {
      setIsCashOnDelivery(false);
    }
  }, [form.watch("payment_method")]);

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_type: "home",
      address: "",
      road: "",
      floor: "",
      house: "",
      is_guest: 0,
      contact_person_name: "",
      contact_person_number: "",
      latitude: 0,
      longitude: 0,
      is_default: false,
    },
  });

  const orderType = form.watch("order_type");

  const handleAddressSubmit = async (values: z.infer<typeof addressSchema>) => {
    try {
      const newAddress = {
        ...values,
        id: editingAddressId || Date.now().toString(),
        latitude: currentLocation?.lat || 0,
        longitude: currentLocation?.lng || 0,
        is_default: values.is_default ? 1 : 0,
        is_guest: 0,
      };

      if (editingAddressId) {
        await updateAddressMutation.mutateAsync(newAddress);
        updateAddress(newAddress);
        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully.",
        });
      } else {
        await addAddressMutation.mutateAsync(newAddress);
        addAddress(newAddress);
        toast({
          title: "Address Added",
          description: "Your address has been added successfully.",
        });
      }

      setEditingAddressId(null);
      setIsAddingNewAddress(false);
      addressForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddressMutation.mutateAsync(id);
      deleteAddress(id);
      toast({
        title: "Address Deleted",
        description: "The address has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    addressForm.reset(address);
  };

  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    addressForm.setValue("address", location.address);
    setShowMap(false);
  };

  const handleStripePaymentSuccess = (paymentIntentId: string) => {
    // console.log("Strapi payment success", paymentIntentId);
    // Submit the form
    const orderData = {
      ...form.getValues(),
      payment_method: "stripe",
      stripe_payment_intent_id: paymentIntentId,
      guest_id: !token ? getGuestId() : undefined,
    };
    onSubmit(orderData);
  };

  const handleCashOnDeliverySubmit = () => {
    form.setValue("payment_method", "cash_on_delivery");
    form.setValue("is_partial", 0);
    const orderData = {
      ...form.getValues(),
      payment_method: "cash_on_delivery",
      is_partial: 0,
      guest_id: !token ? getGuestId() : undefined,
    };
    onSubmit(orderData);
  };

  const handleTakeAwaySubmit = () => {
    form.setValue("order_type", "take_away");
    form.setValue("is_partial", 0);
    form.setValue("payment_method", "cash_on_delivery");
    const orderData = {
      ...form.getValues(),
      delivery_address_id: 0,
      guest_id: !token ? getGuestId() : undefined,
    };
    onSubmit(orderData);
  };
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const orderData = {
      ...values,
      guest_id: !token && getGuestId() ? String(getGuestId()) : undefined,
      cart: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        variations: item.variant,
        add_on_ids: [], //  if have add-ons
        add_on_qtys: [], //  if have add-ons
      })),
    };
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
    onSubmit(orderData);
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
            <FormField
              control={form.control}
              name="order_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("deliveryOptions")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem className="relative">
                        <FormControl>
                          <RadioGroupItem
                            value="delivery"
                            id="delivery"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="delivery"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <MapPin className="mb-2 h-6 w-6" />
                          {t("homeDelivery")}
                        </Label>
                      </FormItem>
                      <FormItem className="relative">
                        <FormControl>
                          <RadioGroupItem
                            value="take_away"
                            id="take_away"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="take_away"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <ShoppingBag className="mb-2 h-6 w-6" />
                          {t("takeAway")}
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {orderType === "delivery" && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">
                      {t("deliveryAddress")}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingNewAddress(true);
                        setEditingAddressId(null);
                        addressForm.reset();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("addAddress")}
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="delivery_address_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
                            required
                          >
                            {/* address list */}
                            <CheckoutAddress
                              handleEditAddress={handleEditAddress}
                              handleDeleteAddress={handleDeleteAddress}
                              addresses={addresses}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <CheckoutAddressForm
                  isAddingNewAddress={isAddingNewAddress}
                  editingAddressId={editingAddressId}
                  addressForm={addressForm}
                  handleAddressSubmit={handleAddressSubmit}
                  setIsAddingNewAddress={setIsAddingNewAddress}
                  setEditingAddressId={setEditingAddressId}
                  setShowMap={setShowMap}
                />

                <DeliveryTips
                  value={deliveryTip || 0}
                  onChange={(value) => setDeliveryTip(value)}
                />

                <PaymentMethods
                  value={form.watch("payment_method")}
                  onChange={(value) => form.setValue("payment_method", value)}
                  onStripePaymentSuccess={handleStripePaymentSuccess}
                  onCashOnDeliverySubmit={handleCashOnDeliverySubmit}
                />
              </>
            )}

            {orderType === "take_away" && (
              <TakeAwayOrderSection
                branch={branch as BaseBranch}
                handleTakeAwaySubmit={handleTakeAwaySubmit}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </form>
      {showMap && (
        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogContent className="sm:max-w-[700px] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>{t("selectLocation")}</DialogTitle>
            </DialogHeader>
            <LocationSelector
              onSelectLocation={handleLocationSelect}
              initialLocation={currentLocation}
            />
          </DialogContent>
        </Dialog>
      )}
    </Form>
  );
}
