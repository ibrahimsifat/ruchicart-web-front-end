"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationSelector } from "@/features/location/location-selector";
import {
  useAddAddress,
  useUpdateAddress,
} from "@/lib/hooks/queries/address/useAddress";
import { Address } from "@/types/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

const addressSchema = z.object({
  contact_person_name: z.string().min(1, "Contact person name is required"),
  address_type: z.enum(["home", "work", "other"]),
  contact_person_number: z.string().min(1, "Contact person number is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
});

export function AddressModal({
  isOpen,
  onClose,
  address,
  setSelectedAddress,
}: {
  isOpen: boolean;
  onClose: () => void;
  address: any;
  setSelectedAddress: (address: any) => void;
}) {
  const isEditing = !!address;
  const [showMap, setShowMap] = useState(false);
  const t = useTranslations("address");
  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      contact_person_name: "",
      address_type: "home",
      contact_person_number: "",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (address) {
      form.reset({
        ...address,
        latitude: address.latitude || 0,
        longitude: address.longitude || 0,
      });
    }
  }, [address, form]);

  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();

  const onSubmit = (data: z.infer<typeof addressSchema>) => {
    if (isEditing) {
      console.log(data);
      updateAddressMutation.mutateAsync(data as Address);
    } else {
      addAddressMutation.mutateAsync(data as Address);
    }
    // onClose();
  };

  const handleLocationSelect = (location: any) => {
    form.setValue("address", location.address);
    form.setValue("latitude", location.lat);
    form.setValue("longitude", location.lng);
    setShowMap(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editAddress") : t("addNewAddress")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as SubmitHandler<any>)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="contact_person_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contactPersonName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("addressType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectAddressType")} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="home">{t("home")}</SelectItem>
                      <SelectItem value="work">{t("work")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_person_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contactPersonNumber")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input {...field} />
                      <Button type="button" onClick={() => setShowMap(true)}>
                        {t("map")}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showMap && (
              <LocationSelector
                onSelectLocation={handleLocationSelect}
                initialLocation={
                  address
                    ? {
                        address: address.address,
                        lat: address.latitude,
                        lng: address.longitude,
                      }
                    : null
                }
              />
            )}
            <Button type="submit">
              {isEditing ? t("updateAddress") : t("addAddress")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
