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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useLocationStore } from "@/store/locationStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Check, ChevronRight, Home, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LocationSelector } from "../location/LocationSelector";

const addressSchema = z.object({
  type: z.enum(["home", "work", "other"]),
  label: z.string().min(1, "Label is required"),
  address: z.string().min(1, "Address is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  contactPerson: z.string().min(1, "Contact person name is required"),
  phone: z.string().min(1, "Phone number is required"),
  additionalInfo: z.string().optional(),
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
  const { currentLocation, addSavedLocation } = useLocationStore();
  const t = useTranslations("checkout");

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialAddress || {
      type: "home",
      label: "",
      address: "",
      area: "",
      city: "",
      contactPerson: "",
      phone: "",
      additionalInfo: "",
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
      id: initialAddress?.id || Date.now().toString(),
      lat: currentLocation?.lat || 0,
      lng: currentLocation?.lng || 0,
    };
    addSavedLocation(newAddress);
    onSave(newAddress);
    onClose();
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
    if (step < 3) setStep(step + 1);
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
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((s) => (
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
                  {s < 3 && (
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
                  name="type"
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
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Label</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="E.g., Home, Office, Mom's House"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <>
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
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter area or neighborhood"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="E.g., Landmark, delivery instructions"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="contactPerson"
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
                  name="phone"
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
              </>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < 3 ? (
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
