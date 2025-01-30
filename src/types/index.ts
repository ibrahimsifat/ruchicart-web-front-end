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

export interface SignUp {
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
  fName?: string;
  lName?: string;
  email?: string;
  image?: string;
  isPhoneVerified?: number;
  emailVerifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  emailVerificationToken?: string;
  phone?: string;
  cmFirebaseToken?: string;
  point?: number;
  loginMedium?: string;
  referCode?: string;
  walletBalance?: number;
  ordersCount?: number;
  wishListCount?: number;
}
export interface Branches {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}
