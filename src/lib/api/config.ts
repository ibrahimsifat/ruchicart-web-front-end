import { ConfigType } from "@/types/config";
import axios from "axios";
import { cache } from "react";

const API_V1 = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
export const fetchConfig = async () => {
  const response = await axios.get(`${API_V1}/config`);
  return response.data;
};

export const getServerConfig = cache(async (): Promise<ConfigType> => {
  const res = await fetch(`${API_V1}/config`, {
    next: { revalidate: 86400, tags: ["config"] },
    headers: {
      Accept: "application/json",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch config");
  const data = await res.json();
  return data;
});

// Create a singleton promise to prevent duplicate calls
let cachedConfig: Promise<ConfigType> | null = null;

export const loadServerConfig = () => {
  if (!cachedConfig) {
    cachedConfig = getServerConfig();
  }
  return cachedConfig;
};

export const revalidateConfig = async () => {
  await fetch("/api/revalidate?tag=config", { method: "POST" });
};

export const fetchDirectionApi = async (params: {
  origin_lat: number;
  origin_long: number;
  destination_lat: number;
  destination_long: number;
}) => {
  const response = await axios.get(`${API_V1}/config/get-direction-api`, {
    params,
  });
  return response.data;
};

export const fetchDeliveryFee = async (branchId: number) => {
  const response = await axios.get(`${API_V1}/config/delivery-fee`, {
    params: { branch_id: branchId },
  });
  return response.data;
};
