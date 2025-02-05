"use client";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { Address, addressZodSchema } from "@/types/address";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import CheckoutAddress from "./checkoutAddresList";
interface CashOnDeliveryProps {
  setIsAddingNewAddress: (value: boolean) => void;
  setEditingAddressId: (value: string | null) => void;
  handleDeleteAddress: (id: number | string) => void;
  addressForm: UseFormReturn<z.infer<typeof addressZodSchema>>;
  addresses: Address[];
  form: UseFormReturn<z.infer<typeof addressZodSchema>>;
}
const CashOnDelivery = ({
  addressForm,
  addresses,
  form,
  setIsAddingNewAddress,
  setEditingAddressId,
  handleDeleteAddress,
}: CashOnDeliveryProps) => {
  const t = useTranslations("checkout");

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    addressForm.reset(address);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">{t("deliveryAddress")}</h3>
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
                value={field.value?.toString() || ""}
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
  );
};

export default CashOnDelivery;
