"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { addressZodSchema } from "@/types/address";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface CheckoutAddressFormProps {
  isAddingNewAddress: boolean;
  editingAddressId: string | null;
  addressForm: UseFormReturn<z.infer<typeof addressZodSchema>>;
  handleAddressSubmit: (data: z.infer<typeof addressZodSchema>) => void;
  setIsAddingNewAddress: (value: boolean) => void;
  setEditingAddressId: (value: string | null) => void;
  setShowMap: (value: boolean) => void;
}

const CheckoutAddressForm = ({
  isAddingNewAddress,
  editingAddressId,
  addressForm,
  handleAddressSubmit,
  setIsAddingNewAddress,
  setEditingAddressId,
  setShowMap,
}: CheckoutAddressFormProps) => {
  const t = useTranslations("checkout");
  return (
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
                {editingAddressId ? t("editAddress") : t("addNewAddress")}
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
                          <Input {...field} placeholder="Enter house number" />
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
                          <Input {...field} placeholder="Enter floor number" />
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
                            Use this address as the default for future orders
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
                      onClick={addressForm.handleSubmit(handleAddressSubmit)}
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
  );
};

export default CheckoutAddressForm;
