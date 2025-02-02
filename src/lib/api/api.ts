import { useAuthStore } from "@/store/authStore";
import { useBranchStore } from "@/store/branchStore";
import axios from "axios";
import Cookies from "js-cookie";

const API_V1 = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const Branch_ID = useBranchStore.getState().currentBranch?.id;
const locale = Cookies.get("NEXT_LOCALE");
const api = axios.create({
  baseURL: API_V1,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "branch-id": `${Branch_ID}`,
    "X-localization": `${locale}`,
  },
});

// Modify the request interceptor to handle CORS preflight
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;
    console.log(token, "token from api");
    console.log(user, "user from api");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // // Ensure CORS headers are present for preflight requests
    // if (config.method?.toUpperCase() === "OPTIONS") {
    //   config.headers["Access-Control-Request-Method"] =
    //     "GET, POST, PUT, DELETE";
    //   config.headers["Access-Control-Request-Headers"] =
    //     "Authorization, Content-Type";
    // }
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
