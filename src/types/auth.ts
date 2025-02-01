export interface LoginFormData {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

export interface RegistrationFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referCode?: string;
  acceptTerms: boolean;
}

export interface SocialMediaData {
  name: string;
  email: string;
  phone: string;
  unique_id: string;
  token: string;
  medium: string;
}
