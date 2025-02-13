import { useAuthStore } from "@/store/authStore";
import { useBranchStore } from "@/store/branchStore";
import axios from "axios";
import Cookies from "js-cookie";
const API_V1 = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

// console.log(currentBranch);
const locale = Cookies.get("NEXT_LOCALE") || "en";

const api = axios.create({
  baseURL: API_V1,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-localization": `${locale}`,
  },
});

// Modify the request interceptor to handle CORS preflight
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const currentBranch = useBranchStore.getState().currentBranch;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["branch-id"] = `${currentBranch?.id}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhance error handling in response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    // Add specific handling for CORS errors
    if (error.message?.includes("Network Error") || !error.response) {
      console.error("Network or CORS error:", error);
    }
    return Promise.reject(error);
  }
);

export { api };
