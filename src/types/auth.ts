export interface LoginFormData {
  emailOrPhone: string
  password: string
  rememberMe: boolean
}

export interface SignUpFormData {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  referCode?: string
  acceptTerms: boolean
}

