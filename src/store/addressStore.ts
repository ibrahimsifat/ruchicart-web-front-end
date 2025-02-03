import { Address } from "@/types/address";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddressState {
  addresses: Address[];
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: number) => void;
  setAddresses: (addresses: Address[]) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      updateAddress: (address) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === address.id ? address : a
          ),
        })),
      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
      setAddresses: (addresses) => set({ addresses: addresses }),
    }),
    {
      name: "address-storage",
    }
  )
);
