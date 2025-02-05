"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Address } from "@/types/address";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

interface CheckoutAddressProps {
  handleEditAddress: (address: any) => void;
  handleDeleteAddress: (addressId: string) => void;
  addresses: Address[];
}

const CheckoutAddressList = ({
  handleEditAddress,
  handleDeleteAddress,
  addresses,
}: CheckoutAddressProps) => {
  return (
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
              <RadioGroupItem value={String(address.id)} />
            </FormControl>
            <Label className="flex-1 cursor-pointer">
              <div className="font-medium">{address.label}</div>
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
                  handleDeleteAddress(String(address.id));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </FormItem>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default CheckoutAddressList;
