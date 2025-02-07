export interface Category {
  id?: number;
  name: string;
  parent_id: number;
  position?: number;
  status?: number;
  priority: number;
  created_at: string;
  updated_at: string;
  image?: string;
  banner_image: string;
  childes: Category[];
  translations: Translation[];
}
interface Translation {
  language_code?: string;
  name?: string;
  // Add other translation fields as needed
}
export interface HeroSlide {
  title: string;
  description: string;
  bgColor: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: string;
  location: string;
  cuisine: string;
}

export interface Address {
  id?: number;
  addressType?: string;
  contactPersonNumber?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  method?: string;
  contactPersonName?: string;
  streetNumber?: string;
  floorNumber?: string;
  houseNumber?: string;
  isDefault?: boolean;
}

export interface Input {
  locationTextController: any; // TextEditingController equivalent
  streetNumberController: any; // TextEditingController equivalent
  houseNumberController: any; // TextEditingController equivalent
  florNumberController: any; // TextEditingController equivalent

  addressNode: any; // FocusNode equivalent
  nameNode: any; // FocusNode equivalent
  stateNode: any; // FocusNode equivalent
  houseNode: any; // FocusNode equivalent
  floorNode: any; // FocusNode equivalent

  branches: Array<Branches | null>;
  countryCode?: string;
  updateAddress: boolean;
  isEnableUpdate: boolean;
  fromCheckout: boolean;
  address?: Address;
}

export interface Prediction {
  description?: string;
  id?: string;
  distanceMeters?: number;
  placeId?: string;
  reference?: string;
}

export interface Registration {
  fName?: string;
  lName?: string;
  phone?: string;
  email: string;
  password?: string;
  referralCode: string;
}

export interface SocialLogin {
  token?: string;
  uniqueId?: string;
  medium?: string;
  email?: string;
}

export interface UserLogData {
  countryCode?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
}

export interface Category {
  id?: number;
  name: string;
  parentId?: number;
  position?: number;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  bannerImage?: string;
}
export interface User {
  id?: number;
  f_name?: string;
  l_name?: string;
  email?: string;
  image?: string;
  is_phone_verified?: number;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  email_verification_token?: string;
  phone?: string;
  cm_firebase_token?: string;
  point?: number;
  login_medium?: string;
  refer_code?: string;
  refer_by?: string;
  wallet_balance?: number;
  orders_count?: number;
  wishlist_count?: number;
}
export interface Branches {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}
