"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  deleteAddress,
  getAddresses,
} from "@/lib/hooks/queries/address/useAddress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Building2, Home, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { AddressModal } from "./addressModal";
import { DeleteConfirmationModal } from "./deleteConfirmationModal";

export function AddressSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const queryClient = useQueryClient();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const {
    data: addresses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Address deleted",
        description: "The address has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: any) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (address: any) => {
    setAddressToDelete(address);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddressMutation.mutate(addressToDelete.id);
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    }
  };

  const getAddressIcon = (type: any) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "work":
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  if (isLoading) return <div>Loading addresses...</div>;
  if (error) return <div>Error loading addresses</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Addresses</CardTitle>
        <Button onClick={handleAddAddress}>Add New Address</Button>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p>No addresses found. Add a new address to get started.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address: any) => (
              <Card key={address.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getAddressIcon(address.address_type)}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {address.contact_person_name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {address.address}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {address.contact_person_number}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => handleEditAddress(address)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        address={selectedAddress}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAddress}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
      />
    </Card>
  );
}
