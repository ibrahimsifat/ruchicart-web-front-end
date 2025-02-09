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
import { toast } from "@/components/ui/use-toast";
import { LocationSelector } from "@/features/location/location-selector";
import { getQueryClient } from "@/lib/api/queries";
import {
  addAddress,
  updateAddress,
} from "@/lib/hooks/queries/address/useAddress";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
}: {
  isOpen: boolean;
  onClose: () => void;
  address: any;
}) {
  const queryClient = getQueryClient();
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

  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: t("addressAdded"),
        description: t("yourAddressHasBeenSuccessfullyAdded"),
      });

      onClose();
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("failedToAddAddressPleaseTryAgain"),
        variant: "destructive",
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: (data: any) => updateAddress(address.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });

      toast({
        title: t("addressUpdated"),
        description: t("yourAddressHasBeenSuccessfullyUpdated"),
      });
      onClose();
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("failedToUpdateAddressPleaseTryAgain"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    if (isEditing) {
      updateAddressMutation.mutate(data);
    } else {
      addAddressMutation.mutate(data);
    }
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
