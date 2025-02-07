import { api } from "@/lib/api/api";
import { queryKeys } from "@/lib/api/queries";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getUserInfo = async () => {
  const response = await api.get("/customer/info");
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await api.put("/customer/update-profile", data);
  return response.data;
};

export const useUserInfo = () => {
  return useQuery<User>({
    queryKey: queryKeys.user.info,
    queryFn: () => getUserInfo(),
  });
};

export const useUpdateUserProfile = () => {
  return useMutation<User, Error, User>({
    mutationFn: (data) => updateUserProfile(data),
  });
};
