import { useToast } from "@/components/ui/use-toast";
import {
  useAddAddress,
  useAddressList,
  useDeleteAddress,
  useUpdateAddress,
} from "@/lib/hooks/queries/address/useAddress";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/locationStore";
import { Address, addressZodSchema } from "@/types/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useAddressManager = () => {
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { toast } = useToast();
  const { currentLocation } = useLocationStore();
  const { token, getGuestId } = useAuthStore();

  const { data: addresses } = useAddressList();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const addressForm = useForm({
    resolver: zodResolver(addressZodSchema),
    defaultValues: {
      address_type: "home",
      address: "",
      road: "",
      floor: "",
      house: "",
      contact_person_name: "",
      contact_person_number: "",
      is_default: false,
    },
  });

  const handleAddressSubmit = async (values: any) => {
    try {
      const newAddress = {
        ...values,
        id: editingAddressId || Date.now(),
        latitude: currentLocation?.lat || 0,
        longitude: currentLocation?.lng || 0,
        is_default: values.is_default ? 1 : 0,
        is_guest: token ? 0 : 1,
      };

      if (editingAddressId) {
        await updateAddressMutation.mutateAsync(newAddress as Address);
      } else {
        await addAddressMutation.mutateAsync(newAddress as Address);
      }

      setEditingAddressId(null);
      setIsAddingNewAddress(false);
      addressForm.reset();

      toast({
        title: editingAddressId ? "Address Updated" : "Address Added",
        description: `Your address has been ${
          editingAddressId ? "updated" : "added"
        } successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    addresses,
    addressForm,
    editingAddressId,
    isAddingNewAddress,
    showMap,
    handleAddressSubmit,
    setEditingAddressId,
    setIsAddingNewAddress,
    setShowMap,
    deleteAddressMutation,
  };
};
