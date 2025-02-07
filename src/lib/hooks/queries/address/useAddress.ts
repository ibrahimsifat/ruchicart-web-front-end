import { api } from "@/lib/api/api";
import { useAuthStore } from "@/store/authStore";
import type { Address } from "@/types/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddressList = () => {
  const { getGuestId, token } = useAuthStore();
  const userId = token ? useAuthStore.getState().user?.id : getGuestId();

  return useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      const { data } = await api.get(`customer/address/list`, {
        params: { guest_id: token ? undefined : userId },
      });

      return data;
    },
    enabled: !!userId, // Only fetch when userId is available
    staleTime: Number.POSITIVE_INFINITY, // addresses are not expected to change frequently
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  const { getGuestId, token } = useAuthStore();
  const userId = token ? useAuthStore.getState().user?.id : getGuestId();

  return useMutation({
    mutationFn: async (address: Address) => {
      const { data } = await api.post(`customer/address/add`, {
        ...address,
        guest_id: userId,
      });
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { getGuestId, token } = useAuthStore();
  const userId = token ? useAuthStore.getState().user?.id : getGuestId();

  return useMutation({
    mutationFn: async (address: Address) => {
      const { data } = await api.put(`customer/address/update/${address.id}`, {
        ...address,
        guest_id: userId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { getGuestId, token } = useAuthStore();
  const userId = token ? useAuthStore.getState().user?.id : getGuestId();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`customer/address/delete`, {
        data: { address_id: id, guest_id: userId },
      });
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] });
    },
  });
};

export const getAddresses = async () => {
  const response = await api.get("/customer/address/list");
  return response.data;
};

export const addAddress = async (data: any) => {
  const response = await api.post("/customer/address/add", data);
  return response.data;
};

export const updateAddress = async (id: string, data: any) => {
  const response = await api.put(`/customer/address/update/${id}`, data);
  return response.data;
};

export const deleteAddress = async (addressId: string) => {
  const response = await api.delete("/customer/address/delete", {
    data: { address_id: addressId },
  });
  return response.data;
};
