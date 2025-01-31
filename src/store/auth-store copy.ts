import { API_BASE_URL } from "@/config";
import { commonHeaders } from "@/lib/api/headers";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithOtp: (phone: string) => Promise<void>;
  verifyLoginOtp: (phone: string, otp: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  verifySignupOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface SignupData {
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!response.ok) throw new Error("Login failed");
          const data = await response.json();
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      loginWithOtp: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/login/otp`,
            { phone },
            { headers: commonHeaders }
          );
          if (response.status !== 200) throw new Error("OTP request failed");
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      verifyLoginOtp: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/login/otp/verify`,
            { phone, otp },
            { headers: commonHeaders }
          );
          if (response.status !== 200)
            throw new Error("OTP verification failed");
          const data = response.data;
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      signup: async (userData: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/registration`,
            userData,
            {
              headers: commonHeaders,
            }
          );
          if (response.status !== 200) throw new Error("Signup failed");
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      verifySignupOtp: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/verify-phone`,
            { phone, token: otp },
            { headers: commonHeaders }
          );
          if (response.status !== 200)
            throw new Error("OTP verification failed");
          const data = response.data;
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
