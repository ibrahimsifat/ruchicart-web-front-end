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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("dashboard");
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
        title: t("addressDeleted"),
        description: t("addressDeletedDescription"),
      });
    },
    onError: () => {
      toast({
        title: t("error"),
        description: t("failedToDeleteAddress"),
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

  const handleDeleteAddress = (id: any) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddressMutation.mutate(addressToDelete);
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

  if (isLoading) return <div>{t("loadingAddresses")}</div>;
  if (error) return <div>{t("errorLoadingAddresses")}</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("myAddresses")}</CardTitle>
        <Button onClick={handleAddAddress}>{t("addNewAddress")}</Button>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p>{t("noAddressesFound")}</p>
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
                      {t("edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      {t("delete")}
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
        title={t("deleteAddress")}
        description={t("deleteAddressDescription")}
      />
    </Card>
  );
}
