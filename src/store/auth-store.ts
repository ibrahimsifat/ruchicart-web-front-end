import { API_BASE_URL } from "@/config";
import { api } from "@/lib/api/api";
import { auth, googleProvider } from "@/lib/firebase";
import { formatFirebaseAuthError } from "@/lib/utils/firebase-errors";
import { SocialMediaData } from "@/types/auth";
import axios from "axios";
import {
  ConfirmationResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  f_name: string;
  l_name: string;
}
interface LoginData {
  email_or_phone: string;
  password: string;
  type: string;
}

interface GoogleUserData {
  name: string;
  email: string;
  unique_id: string;
  token: string;
  medium: string;
}
type GoogleLoginResponse = {
  status: boolean;
  token?: string;
  tempToken?: boolean;
  userData?: {
    name: string | null;
    email: string | null;
    unique_id: string;
    token: string;
    medium: "google";
  };
};

export type ExistingAccountResponse = {
  temp_token?: string;
  token?: string;
  status: boolean;
};
interface GooglePhoneVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  googleUserData: GoogleUserData;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  verificationId: string | null;
  login: (loginData: LoginData) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  firebaseAuthVerify: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  clearError: () => void;
  getProfileInfo: () => Promise<User | null>;
  initializeRecaptcha: (elementId?: string) => Promise<RecaptchaVerifier>;
  sendOTP: (phone: string) => Promise<void>;
  registerWithSocialMedia: (data: SocialMediaData) => Promise<void>;
  existingAccountCheck: (
    data: ExistingAccountCheckData
  ) => Promise<ExistingAccountResponse>;

  googleLogin: () => Promise<GoogleLoginResponse>;

  checkEmail: (email: string) => Promise<boolean>;
  socialLogin: (
    token: string,
    uniqueId: string,
    email: string,
    medium: string
  ) => Promise<void>;
}

interface SignupData {
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  password: string;
}
type ExistingAccountCheckData = {
  email?: string;
  phone?: string;
  medium: "google" | "facebook" | "apple" | "otp";
  user_response: 0 | 1; // 0 for new account, 1 for use existing
};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: ConfirmationResult | null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      verificationId: null,

      initializeRecaptcha: async (elementId = "recaptcha-container") => {
        try {
          // Clear existing recaptcha if it exists
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          }

          // Ensure the container element is empty
          const container = document.getElementById(elementId);
          if (container && container.childNodes.length > 0) {
            container.innerHTML = ""; // Clear any existing content
          }

          const verifier = new RecaptchaVerifier(auth, elementId, {
            size: "invisible", // Use invisible reCAPTCHA
            callback: () => {
              // reCAPTCHA solved
            },
          });

          window.recaptchaVerifier = verifier;
          return verifier;
        } catch (error) {
          console.error("Error initializing reCAPTCHA:", error);
          throw error;
        }
      },
      sendOTP: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          // Format phone number for Firebase
          const phoneNumberWithCode = `+${phone}`;

          if (!window.recaptchaVerifier) {
            throw new Error("Recaptcha verifier not initialized");
          }
          const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumberWithCode,
            window.recaptchaVerifier
          );
          window.confirmationResult = confirmationResult;

          set({ verificationId: confirmationResult.verificationId });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      getProfileInfo: async () => {
        const token = get().token;
        if (!token) {
          console.error("No authentication token available");
          return null;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/customer/info");
          const userData = response.data;
          set({ user: userData, isLoading: false });
          return userData;
        } catch (error) {
          let errorMessage = "Failed to fetch profile information";

          if (axios.isAxiosError(error)) {
            if (error.response?.data?.errors?.length) {
              errorMessage = error.response.data.errors[0].message;
            } else {
              errorMessage = error.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage, isLoading: false });
          console.error("Profile Info Error:", errorMessage);
          throw new Error(errorMessage);
        }
      },
      login: async (loginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", loginData);
          const data = response.data;
          set({ token: data.token, isLoading: false });
        } catch (error) {
          let errorMessage = "Invalid login credentials";

          if (axios.isAxiosError(error)) {
            // Check if response exists and has an 'errors' array
            if (error.response?.data?.errors?.length) {
              errorMessage = error.response.data.errors[0].message;
            } else {
              errorMessage = error.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage, isLoading: false });
          console.error("Login Error:", errorMessage);
          throw new Error(errorMessage);
        }
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          // First verify with Firebase
          if (!window.confirmationResult) {
            throw new Error(
              "Confirmation result not found. Please send OTP first."
            );
          }
          const result = await window.confirmationResult.confirm(otp);
          console.log(result); // Debugging
          if (!result.user) throw new Error("Firebase verification failed");

          // Then verify with your backend
          const response = await api.post("/auth/firebase-auth-verify", {
            sessionInfo: get().verificationId,
            phoneNumber: phone,
            code: otp,
          });
          console.log(response);
          if (response.data.token) {
            set({ token: response.data.token });
            // Handle any additional user data
          }
        } catch (error: any) {
          const errorMessage = formatFirebaseAuthError(error);
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      signup: async (userData: SignupData) => {
        set({ isLoading: true, error: null });
        console.log(userData);
        try {
          const response = await api.post(
            `/api/v1/auth/registration`,
            userData
          );
          if (response.status !== 200) throw new Error("Signup failed");
          set({ isLoading: false });
        } catch (error) {
          let errorMessage = "Signup failed";

          if (axios.isAxiosError(error)) {
            // Check if response exists and has an 'errors' array
            if (error.response?.data?.errors?.length) {
              errorMessage = error.response.data.errors[0].message;
            } else {
              errorMessage = error.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage, isLoading: false });
          console.error("Login Error:", errorMessage);
          throw new Error(errorMessage);
        }
      },

      firebaseAuthVerify: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/firebase-auth-verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "branch-id": "1",
                "X-localization": "en",
              },
              body: JSON.stringify({ phone, token: otp }),
            }
          );
          if (!response.ok) throw new Error("OTP verification failed");
          const data = await response.json();
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          let errorMessage = "OTP verification failed";

          if (axios.isAxiosError(error)) {
            // Check if response exists and has an 'errors' array
            if (error.response?.data?.errors?.length) {
              errorMessage = error.response.data.errors[0].message;
            } else {
              errorMessage = error.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage, isLoading: false });
          console.error("Login Error:", errorMessage);
          throw new Error(errorMessage);
        }
      },
      verifySignupOtp_manual: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/v1/auth/verify-phone`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "branch-id": "1",
                "X-localization": "en",
              },
              body: JSON.stringify({ phone, token: otp }),
            }
          );
          if (!response.ok) throw new Error("OTP verification failed");
          const data = await response.json();
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          let errorMessage = "OTP verification failed";

          if (axios.isAxiosError(error)) {
            // Check if response exists and has an 'errors' array
            if (error.response?.data?.errors?.length) {
              errorMessage = error.response.data.errors[0].message;
            } else {
              errorMessage = error.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage, isLoading: false });
          console.error("Login Error:", errorMessage);
          throw new Error(errorMessage);
        }
      },
      socialLogin: async (
        token: string,
        uniqueId: string,
        email: string,
        medium: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/auth/social-customer-login`, {
            token,
            unique_id: uniqueId,
            email,
            medium,
          });
          set({
            user: response.data.user,
            token: response.data.token,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      googleLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const accessToken = credential?.accessToken;

          if (!accessToken) {
            throw new Error("No access token found");
          }

          // First check if email exists
          const emailExists = await api.post(`/auth/check-email`, {
            email: user.email,
          });

          if (emailExists.data.isExist == 1) {
            // If email exists, directly try social login
            const response = await api.post(`/auth/social-customer-login`, {
              token: accessToken,
              unique_id: user.uid,
              email: user.email,
              medium: "google",
            });

            set({ isLoading: false, token: response?.data.token });
            return response.data;
          } else {
            // If email doesn't exist, return data for registration
            console.log("userdata", user);
            set({ isLoading: false });
            return {
              status: false,
              tempToken: true,
              userData: {
                name: user.displayName,
                email: user.email,
                unique_id: user.uid,
                token: accessToken,
                medium: "google",
              },
            };
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      checkEmail: async (email: string) => {
        try {
          const response = await api.post(`/auth/check-email`, {
            email,
          });
          return response.data.isExist === 1;
        } catch (error) {
          console.error("Error checking email:", error);
          return false;
        }
      },

      registerWithSocialMedia: async (data: SocialMediaData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(
            `/auth/registration-with-social-media`,
            data
          );
          set({
            token: response.data.token,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      existingAccountCheck: async (data: ExistingAccountCheckData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/existing-account-check", data);
          set({ isLoading: false });
          return response.data;
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
