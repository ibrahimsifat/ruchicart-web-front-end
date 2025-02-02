"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocationStore } from "@/store/locationStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, MapPin, Plus, ShoppingBag, UtensilsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AddressModal } from "./address-modal";
import { DeliveryTips } from "./delivery-tips";
import { PaymentMethods } from "./payment-methods";

const formSchema = z.object({
  deliveryOption: z.enum(["home", "takeaway"]),
  address: z.string().optional(),
  deliveryTip: z.number().min(0).optional(),
  paymentMethod: z.string(),
  branch: z.string().optional(),
  orderNote: z.string().optional(),
  cutlery: z.boolean().optional(),
  deliveryArea: z.string().optional(),
});

interface CheckoutFormProps {
  onPlaceOrder: (values: any) => void;
  placingOrder: boolean;
}

export function CheckoutForm({
  onPlaceOrder,
  placingOrder,
}: CheckoutFormProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { currentLocation, savedLocations } = useLocationStore();
  const t = useTranslations("checkout");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryOption: "home",
      address: currentLocation?.address || "",
      deliveryTip: 0,
      paymentMethod: "",
      branch: "",
      orderNote: "",
      cutlery: false,
      deliveryArea: "",
    },
  });

  const deliveryOption = form.watch("deliveryOption");

  const handleAddressSelect = (address: any) => {
    form.setValue("address", address.id);
    setShowAddressModal(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onPlaceOrder(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              name="deliveryOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("deliveryOptions")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <FormItem className="relative">
                        <FormControl>
                          <RadioGroupItem
                            value="home"
                            id="home"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="home"
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <MapPin className="mb-2 h-6 w-6" />
                          {t("homeDelivery")}
                        </Label>
                      </FormItem>
                      <FormItem className="relative">
                        <FormControl>
                          <RadioGroupItem
                            value="takeaway"
                            id="takeaway"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="takeaway"
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

            {deliveryOption === "home" && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">
                      {t("deliveryAddress")}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("addAddress")}
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
                          >
                            {savedLocations.map((location, index) => (
                              <FormItem
                                key={index}
                                className="flex items-center space-x-3 space-y-0 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors"
                              >
                                <FormControl>
                                  <RadioGroupItem value={location.id} />
                                </FormControl>
                                <Label className="flex-1 cursor-pointer">
                                  <div className="font-medium">
                                    {location.type}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {location.address}
                                  </div>
                                </Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setShowAddressModal(true);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DeliveryTips
                  value={form.watch("deliveryTip") || 0}
                  onChange={(value) => form.setValue("deliveryTip", value)}
                />
              </>
            )}

            {deliveryOption === "takeaway" && (
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-semibold">
                      {t("selectNearbyBranch")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("chooseBranch")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Add your branch options here */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="orderNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any special instructions"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cutlery"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    <UtensilsIcon className="h-4 w-4 mr-2" />
                    Add cutlery
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryArea"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold">
                    Select Delivery Area
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Replace with your actual delivery area options */}
                      <SelectItem value="area1">Area 1</SelectItem>
                      <SelectItem value="area2">Area 2</SelectItem>
                      <SelectItem value="area3">Area 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PaymentMethods
              value={form.watch("paymentMethod") || ""}
              onChange={(value) => form.setValue("paymentMethod", value)}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={placingOrder}>
          {placingOrder
            ? "Placing Order..."
            : deliveryOption === "home"
            ? t("proceedToPayment")
            : t("confirmTakeAwayOrder")}
        </Button>
      </form>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleAddressSelect}
        initialAddress={null}
      />
    </Form>
  );
}
