"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CustomImage from "@/components/ui/customImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
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
import { ImageType } from "@/types/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LocationSelector } from "../location/LocationSelector";
import { DeliveryTips } from "./delivery-tips";
import { PaymentMethods } from "./payment-methods";

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
  const [acceptTerms, setAcceptTerms] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_amount: total,
      guest_id: !token ? getGuestId() : undefined,
      payment_method: "",
      order_type: "delivery",
      branch_id: branch?.id || "",
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
      await deleteAddressMutation.mutateAsync(Number.parseInt(id));
      deleteAddress(Number.parseInt(id));
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
      guest_id: !token ? getGuestId() : undefined,
      cart: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        variations: item.variations,
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
                            <AnimatePresence>
                              {addresses.map((address) => (
                                <motion.div
                                  key={address.id}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
                                    <FormControl>
                                      <RadioGroupItem value={address.id} />
                                    </FormControl>
                                    <Label className="flex-1 cursor-pointer">
                                      <div className="font-medium">
                                        {address.label}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {address.address}
                                      </div>
                                    </Label>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleEditAddress(address);
                                        }}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteAddress(
                                            address.id.toString()
                                          );
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </FormItem>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <AnimatePresence>
                  {(isAddingNewAddress || editingAddressId) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle>
                            {editingAddressId
                              ? t("editAddress")
                              : t("addNewAddress")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form {...addressForm}>
                            <div className="space-y-4">
                              <FormField
                                control={addressForm.control}
                                name="address_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("addressType")}</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                      >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="home" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {t("home")}
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="work" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {t("work")}
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="other" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {t("other")}
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("address")}</FormLabel>
                                    <FormControl>
                                      <div className="flex gap-2">
                                        <Input
                                          {...field}
                                          placeholder={t("enterAddress")}
                                          className="flex-1"
                                        />
                                        <Button
                                          type="button"
                                          onClick={() => setShowMap(true)}
                                        >
                                          <MapPin className="w-4 h-4 mr-2" />
                                          {t("selectOnMap")}
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="road"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Road</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Enter road or neighborhood"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="house"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>House</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Enter house number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="floor"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Floor</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Enter floor number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={addressForm.control}
                                name="contact_person_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("contactPerson")}</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder={t("enterContactPerson")}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="contact_person_number"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t("phoneNumber")}</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder={t("enterPhoneNumber")}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="is_default"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Set as default address
                                      </FormLabel>
                                      <FormDescription>
                                        Use this address as the default for
                                        future orders
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsAddingNewAddress(false);
                                    setEditingAddressId(null);
                                    addressForm.reset();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={addressForm.handleSubmit(
                                    handleAddressSubmit
                                  )}
                                >
                                  {editingAddressId ? "Update" : "Add"} Address
                                </Button>
                              </div>
                            </div>
                          </Form>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

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
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {t("selectedBranch")}{" "}
                  <span className="text-primary">{branch?.name}</span>
                </Label>
                <Card key={branch?.id} className="overflow-hidden duration-300">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-2/5 h-48 sm:h-auto">
                      <CustomImage
                        src={branch?.image || "/placeholder-branch.jpg"}
                        alt={branch?.name || ""}
                        type={ImageType.BRANCH}
                        fill
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {branch?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {branch?.address}
                          </p>
                        </div>
                        <Avatar className="h-12 w-12 border-2 border-primary">
                          <AvatarImage src={branch?.image} alt={branch?.name} />
                          <AvatarFallback>
                            {branch?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">{branch?.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">{branch?.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">
                            {branch?.preparation_time} mins prep time
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-3 text-primary" />
                          <span className="text-sm">
                            {branch?.coverage} km coverage
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                <div className="relative z-10 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-6 border-t">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked as boolean)
                      }
                    />
                    <label htmlFor="terms" className="text-sm leading-none">
                      I agree that placing the order places me under{" "}
                      <Button variant="link" className="h-auto p-0">
                        Terms and Conditions
                      </Button>{" "}
                      &{" "}
                      <Button variant="link" className="h-auto p-0">
                        Privacy Policy
                      </Button>
                    </label>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleTakeAwaySubmit();
                    }}
                    className="w-full"
                    disabled={isLoading || !acceptTerms}
                  >
                    {isLoading ? t("processing") : t("confirmTakeAwayOrder")}
                  </Button>
                </div>
              </div>
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
