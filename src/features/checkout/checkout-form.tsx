"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDistance } from "@/lib/hooks/queries/location/useLocation";
import { useLocationStore } from "@/store/locationStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Edit2,
  Home,
  MapPin,
  MapPinned,
  Plus,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AddressModal } from "./address-modal";
import { DeliveryTips } from "./delivery-tips";
import { OrderSummary } from "./order-summary"; // Import OrderSummary component
import { PaymentMethods } from "./payment-methods";

const formSchema = z.object({
  deliveryOption: z.enum(["home", "takeaway"]),
  address: z.string().optional(),
  contactInfo: z.string().optional(),
  deliveryTip: z.number().optional(),
  paymentMethod: z.string().optional(),
  branch: z.string().optional(),
  deliveryFee: z.number(),
});

const savedAddresses = [
  {
    id: "1",
    type: "home",
    fullAddress:
      "4673 Sayyid Ash Shuhada, 7698, Al Amir Abdoulmajed District, Jeddah 22432, Saudi Arabia",
    contactPerson: "John Doe",
    phone: "+966 558845503",
  },
  {
    id: "2",
    type: "office",
    fullAddress:
      "123 Business Center, King Abdullah Road, Jeddah 23456, Saudi Arabia",
    contactPerson: "John Doe",
    phone: "+966 558845503",
  },
];

const nearbyBranches = [
  { id: "1", name: "Downtown Branch", address: "123 Main St, Downtown" },
  { id: "2", name: "Westside Branch", address: "456 West Ave, Westside" },
  { id: "3", name: "Northend Branch", address: "789 North Blvd, Northend" },
];

export function CheckoutForm() {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [filteredBranches, setFilteredBranches] = useState(nearbyBranches);
  const { location } = useLocationStore();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const { data: distanceData, refetch: refetchDistance } = useGetDistance(
    location ? { lat: location.lat, lng: location.lng } : { lat: 0, lng: 0 },
    selectedAddress
      ? { lat: selectedAddress.lat, lng: selectedAddress.lng }
      : { lat: 0, lng: 0 }
  );

  useEffect(() => {
    if (location && selectedAddress) {
      refetchDistance();
    }
  }, [location, selectedAddress, refetchDistance]);

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    form.setValue("address", address.id);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryOption: "home",
      address: "",
      contactInfo: "",
      deliveryTip: 0,
      paymentMethod: "",
      branch: "",
      deliveryFee: 30, // Added default value for deliveryFee
    },
  });

  const deliveryOption = form.watch("deliveryOption");

  useEffect(() => {
    const fee = deliveryOption === "takeaway" ? 0 : 4715.38;
    form.setValue("deliveryFee", fee);
  }, [deliveryOption, form]);

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = (address: any) => {
    console.log("Saving address:", address);
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "office":
        return <Building2 className="h-5 w-5" />;
      default:
        return <MapPinned className="h-5 w-5" />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="deliveryOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Delivery Options</FormLabel>
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
                          Home Delivery
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
                          Take Away
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
                {/* Delivery Addresses */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">
                      Delivery Addresses
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {savedAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-start gap-4 p-4 rounded-lg border bg-card transition-colors hover:bg-accent"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getAddressIcon(address.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {address.type}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({address.contactPerson})
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.fullAddress}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.phone}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Tips */}
                <DeliveryTips
                  value={form.watch("deliveryTip") || 0}
                  onChange={(value) => form.setValue("deliveryTip", value)}
                />

                {/* Payment Methods */}
                <PaymentMethods
                  value={form.watch("paymentMethod") || ""}
                  onChange={(value) => form.setValue("paymentMethod", value)}
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
                      Select Nearby Branch
                    </FormLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search branches..."
                        className="pl-10 pr-4 py-2 w-full"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          setFilteredBranches(
                            nearbyBranches.filter(
                              (branch) =>
                                branch.name
                                  .toLowerCase()
                                  .includes(searchTerm) ||
                                branch.address
                                  .toLowerCase()
                                  .includes(searchTerm)
                            )
                          );
                        }}
                      />
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {filteredBranches.map((branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id}
                            className="py-3 px-4 hover:bg-accent cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{branch.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {branch.address}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Added OrderSummary component */}
        <OrderSummary
          items={[]}
          total={0}
          deliveryFee={form.watch("deliveryFee")}
        />

        <Button type="submit" className="w-full">
          {deliveryOption === "home"
            ? "Proceed to Payment"
            : "Confirm Take Away Order"}
        </Button>
      </form>

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
      />
    </Form>
  );
}
