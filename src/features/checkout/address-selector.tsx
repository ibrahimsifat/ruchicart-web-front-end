"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AddressModal } from "@/features/checkout/address-modal";
import { getAddressList } from "@/lib/api";
import { useEffect, useState } from "react";

type Address = {
  id: string;
  address_type: string;

  address: string;
  contact_person_name: string;
  contact_person_number: string;
};

type AddressSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  isAuthenticated: boolean;
};

export function AddressSelector({
  value,
  onChange,
  isAuthenticated,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      const addressList = await getAddressList();
      setAddresses(addressList);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressAdded = () => {
    setIsAddressModalOpen(false);
    fetchAddresses();
  };

  return (
    <div>
      <RadioGroup onValueChange={onChange} value={value}>
        {addresses.map((address) => (
          <Card key={address.id} className="mb-4 p-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={address.id} id={address.id} />
              <div>
                <h3 className="font-semibold">{address.address_type}</h3>
                <p className="text-sm text-gray-600">{address.address}</p>
                <p className="text-sm text-gray-600">
                  {address.contact_person_name} -{" "}
                  {address.contact_person_number}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
      <Button onClick={handleAddAddress}>Add New Address</Button>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressAdded={handleAddressAdded}
      />
    </div>
  );
}
