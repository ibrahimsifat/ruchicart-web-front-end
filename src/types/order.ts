import { BaseBranch } from "./branch";

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

interface ProductDetails {
  id: number;
  name: string;
  add_ons: any[];
  attributes: any[];
  available_time_ends: string;
  available_time_starts: string;
  branch_id: string;
  category_ids: CategoryId[];
  choice_options: any[];
  colors: any;
  created_at: string;
  description: string;
  discount: number;
  discount_type: string;
  image: string;
  is_recommended: number;
  popularity_count: number;
  price: number;
  product_type: string;
  set_menu: number;
  status: number;
  tax: number;
  tax_type: string;
  translations: any[];
  updated_at: string;
  variations: any[];
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

interface ProductDetails {
  id: number;
  name: string;
  add_ons: any[];
  attributes: any[];
  available_time_ends: string;
  available_time_starts: string;
  branch_id: string;
  category_ids: CategoryId[];
  choice_options: any[];
  colors: any;
  created_at: string;
  description: string;
  discount: number;
  discount_type: string;
  image: string;
  is_recommended: number;
  popularity_count: number;
  price: number;
  product_type: string;
  set_menu: number;
  status: number;
  tax: number;
  tax_type: string;
  translations: any[];
  updated_at: string;
  variations: any[];
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

export interface Order {
  id: number;
  user_id: number;
  is_guest: string;
  order_amount: number;
  coupon_discount_amount: number;
  coupon_discount_title: string | null;
  created_at: string;
  delivery_address: DeliveryAddress;
  delivery_address_id: number;
  delivery_charge: number;
  delivery_date: string;
  delivery_man: any;
  delivery_man_id: any;
  delivery_time: string;
  deliveryman_review: any;
  details: OrderDetail[];
  extra_discount: string;
  is_cutlery_required: number;
  is_product_available: number;
  number_of_people: any;
  offline_payment: any;
  offline_payment_information: any;
  order_note: string | null;
  order_partial_payments: any[];
  order_status: string;
  order_type: string;
  payment_method: string;
  payment_status: string;
  preparation_time: string;
  table_id: any;
  table_order_id: any;
  total_tax_amount: number;
  transaction_reference: string | null;
  updated_at: string;
}

export interface TrackOrderItem {
  add_on_ids: number[] | null;
  branch: BaseBranch;
  branch_id: string;
  callback: any;
  checked: string;
  coupon_code: string | null;
  coupon_discount_amount: number;
  coupon_discount_title: string | null;
  created_at: string;
  delivery_address: DeliveryAddress;
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
  is_guest: string;
  is_product_available: number;
  number_of_people: any;
  offline_payment: any;
  offline_payment_information: any;
  order: Order;
  order_amount: number;
  order_note: string | null;
  order_partial_payments: any[];
  order_status: string;
  order_type: string;
  payment_method: string;
  payment_status: string;
  preparation_time: string;
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
}

export interface OrderListResponse {
  limit: number;
  offset: number;
  total_size: number;
  orders: Order[];
}
