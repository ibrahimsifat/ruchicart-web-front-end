import { memo } from "react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { Address } from "@/types/address";
import { Plus } from "lucide-react";
import CheckoutAddressList from "./checkoutAddresList";

export const AddressSection = memo(
  ({
    addresses,
    form,
    onAddNew,
    onEdit,
    onDelete,
    t,
  }: {
    addresses: Address[];
    form: any;
    onAddNew: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    t: any;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">{t("deliveryAddress")}</h3>
        <Button variant="outline" size="sm" onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addAddress")}
        </Button>
      </div>

      <FormField
        control={form.control}
        name="delivery_address_id"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value?.toString() || ""}
                className="space-y-2"
                required
              >
                <CheckoutAddressList
                  addresses={addresses}
                  handleEditAddress={onEdit}
                  handleDeleteAddress={onDelete}
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
);
