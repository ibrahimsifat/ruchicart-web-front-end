"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import {
  useAddAddress,
  useUpdateAddress,
} from "@/lib/hooks/queries/address/useAddress";
import { useAddressStore } from "@/store/addressStore";
import { useLocationStore } from "@/store/locationStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Check, ChevronRight, Home, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LocationSelector } from "../location/LocationSelector";

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

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: any) => void;
  initialAddress?: any;
}

export function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress,
}: AddressModalProps) {
  const [step, setStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const { currentLocation } = useLocationStore();
  const t = useTranslations("checkout");
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const { addAddress, updateAddress } = useAddressStore();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialAddress || {
      address_type: "home",
      label: "",
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

  useEffect(() => {
    if (initialAddress) {
      form.reset(initialAddress);
    }
  }, [initialAddress, form]);

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    const newAddress = {
      ...values,
      id: initialAddress?.id || Date.now(),
      latitude: currentLocation?.lat || 0,
      longitude: currentLocation?.lng || 0,
      is_default: values.is_default ? 1 : 0,
      is_guest: 0,
    };

    try {
      if (initialAddress) {
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

      onSave(newAddress);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    form.setValue("address", location.address);
    setShowMap(false);
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {initialAddress ? t("editAddress") : t("addNewAddress")}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Enter your address details and location"
              : "Provide contact information for this address"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 2 && (
                    <ChevronRight
                      className={`w-4 h-4 mx-2 ${
                        step > s ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <>
                <FormField
                  control={form.control}
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
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="home" id="home" />
                            <Label htmlFor="home" className="flex items-center">
                              <Home className="w-4 h-4 mr-2" />
                              {t("home")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="work" id="work" />
                            <Label htmlFor="work" className="flex items-center">
                              <Building2 className="w-4 h-4 mr-2" />
                              {t("work")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">{t("other")}</Label>
                          </div>
                        </RadioGroup>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="road"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Road</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter road name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter floor number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="contact_person_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phoneNumber")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("enterPhoneNumber")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Set as default address</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="default-true" />
                            <Label htmlFor="default-true">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="default-false" />
                            <Label htmlFor="default-false">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < 2 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  {t("saveAddress")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>

      {showMap && (
        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogContent className="sm:max-w-[700px] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>{t("selectLocation")}</DialogTitle>
              <DialogDescription>
                Select your location on the map or search for an address
              </DialogDescription>
            </DialogHeader>
            <LocationSelector
              onSelectLocation={handleLocationSelect}
              initialLocation={currentLocation}
            />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
