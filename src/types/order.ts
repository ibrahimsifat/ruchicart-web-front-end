import { User } from ".";
import { BaseBranch } from "./branch";
import { Variation } from "./product";

interface DeliveryAddress {
  id: number;
  address_type: string;
  contact_person_name: string;
  contact_person_number: string;
  created_at: string;
  floor: string;
  house: string;
  is_default: string;
  latitude: string;
  longitude: string;
  road: string;
  updated_at: string;
  user_id: number;
  address: string;
}

interface CategoryId {
  id: string;
  position: number;
}

interface AddOn {
  id: number;
  price: number;
  qty: number;
  tax_amount: number;
  taxes: any[];
}

interface CategoryId {
  id: string;
  position: number;
}

interface OrderDetail {
  id: number;
  product_id: number;
  order_id: number;
  price: number;
  add_on_ids: number[];
  add_on_prices: string; // This should be an array of numbers, but it's a string in your data
  add_on_qtys: string; // This should be an array of numbers, but it's a string in your data
  add_on_tax_amount: number;
  add_on_taxes: string; // This should be an array, but it's a string in your data
  created_at: string;
  discount_on_product: number;
  discount_type: string;
  product_details: ProductDetails;
  quantity: number;
  tax_amount: number;
  updated_at: string;
  variant: any[];
  variation: any[];
}

export interface TrackOrderItem {
  add_on_ids: number[] | null;
  branch: BaseBranch;
  branch_id: number;
  callback: any;
  checked: number;
  coupon_code: string | null;
  coupon_discount_amount: number;
  coupon_discount_title: string | null;
  created_at: string;
  delivery_address?: DeliveryAddress | null;
  delivery_address_id: number;
  delivery_charge: number;
  delivery_date: string;
  delivery_man: any;
  delivery_man_id: any;
  delivery_time: string;
  details: OrderDetail[];
  extra_discount: string;
  id: number;
  is_cutlery_required: number;
  is_guest: number;
  is_product_available: number;
  number_of_people: any;
  offline_payment: any;
  offline_payment_information: any;
  order: Order;
  order_amount: number;
  order_note: string | null;
  order_partial_payments: any[];
  order_status:
    | "pending"
    | "confirmed"
    | "processing"
    | "out_for_delivery"
    | "delivered"
    | "canceled";
  order_type: "delivery" | "take_away";
  payment_method: string;
  payment_status: "paid" | "unpaid";
  preparation_time: number;
  table_id: any;
  table_order_id: any;
  total_tax_amount: number;
  transaction_reference: string | null;
  updated_at: string;
  user_id: number;
}

export interface OrderDetailsItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  discount_on_product: number;
  discount_type: string;
  tax_amount: number;
  add_on_tax_amount: number;
  add_on_ids: number[];
  add_on_prices: number[];
  add_on_qtys: number[];
  add_on_taxes: number[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_product_available: boolean;
  reviews_count: string;
  variant: any[]; // Define a more specific type if applicable
  variation: any[]; // Define a more specific type if applicable
  product_details: ProductDetails;
  order: Order;
  reviews: Review[];
}

export interface OrderListResponse {
  limit: number;
  offset: number;
  total_size: number;
  orders: Order[];
}

interface Category {
  id: string;
  position: number;
}

interface ChoiceOption {
  // Define properties if needed, otherwise leave empty
}

interface Translation {
  // Define properties if needed, otherwise leave empty
}

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  variations: Variation[]; // Or define a type for variations
  add_ons: AddOn[]; // Or define a type for add-ons
  tax: number;
  available_time_starts: string;
  available_time_ends: string;
  status: number;
  created_at: string;
  updated_at: string;
  attributes: []; // Or define a type for attributes
  category_ids: Category[];
  choice_options: ChoiceOption[];
  discount: number;
  discount_type: string;
  tax_type: string;
  set_menu: number;
  branch_id: string;
  colors: null | string;
  popularity_count: number;
  product_type: string;
  is_recommended: number;
  translations: Translation[];
}

interface DeliveryMan {
  branch_id: number;
  email: string;
  f_name: string;
  id: number;
  image: string;
  is_active: 1 | 0;
  l_name: string;
  phone: string;
  rating: [];
  delivery_date: string;
}

export interface Order {
  id: number;
  user_id: number;
  is_guest: number;
  order_amount: number;
  payment_status: "paid" | "unpaid" | "partial_paid";
  order_status:
    | "pending"
    | "confirmed"
    | "processing"
    | "out_for_delivery"
    | "delivered"
    | "canceled";
  payment_method: string;
  order_type: "delivery" | "take_away";
  coupon_discount_amount: number;
  coupon_discount_title: null | string;
  total_tax_amount: number;
  transaction_reference: null | string;
  delivery_address_id: number;
  created_at: string;
  updated_at: string;
  checked: number;
  delivery_man_id: null | number;
  delivery_man?: null | DeliveryMan;
  delivery_charge: number;
  order_note: null | string;
  product_images?: string[];
  total_quantity?: number;
  coupon_code: null | string;
  branch_id: number;
  branch: BaseBranch;
  callback: null | string;
  delivery_date: string;
  delivery_time: string;
  extra_discount: string;
  delivery_address?: DeliveryAddress | null;
  preparation_time: number;
  table_id: null | number;
  number_of_people: null | number;
  table_order_id: null | number;
  is_cutlery_required: number;
  order_partial_payments: any[];
  offline_payment: null;
  deliveryman_review?: null;
}

export interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  price: number;
  product_details: ProductDetails;
  variation: [];
  discount_on_product: number;
  discount_type: string;
  quantity: number;
  tax_amount: number;
  created_at: string;
  updated_at: string;
  add_on_ids: [];
  variant: [];
  add_on_qtys: [];
  add_on_taxes: [];
  add_on_prices: [];
  add_on_tax_amount: number;
  reviews_count: number;
  is_product_available: number;
  order: Order;
  reviews: Review[];
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  attachment: [];
  rating: number;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  order_id: number;
  customer: User;
}
export interface StatusStep {
  status: string;
  color: string;
  icon: React.ElementType;
  label: string;
}

export interface OrderPlaceHolderData {
  id?: number;
  order_amount: number;
  payment_method: string;
  order_type: string;
  delivery_address_id?: number;
  branch_id?: number;
  delivery_time: string;
  delivery_date: string;
  distance: number;
  is_partial: boolean;
  cart: any[];
  guest_id?: number;
  change_amount?: string;
  stripe_payment_intent_id?: string;
}
