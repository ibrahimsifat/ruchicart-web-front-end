import { ConfigType } from "@/types/config";

const defaultConfig: ConfigType = {
  delivery_charge: 0,
  maintenance_mode: false,
  advance_maintenance_mode: {
    maintenance_status: 0,
    selected_maintenance_system: {
      branch_panel: 0,
      customer_app: 0,
      web_app: 0,
      deliveryman_app: 0,
    },
    maintenance_messages: {
      business_number: 0,
      business_email: 0,
      maintenance_message: "",
      message_body: "",
    },
    maintenance_type_and_duration: {
      maintenance_duration: "",
      start_date: null,
      end_date: null,
    },
  },
  restaurant_name: "RuciCart",
  restaurant_phone: "",
  restaurant_email: "info@ruchicart.com",
  restaurant_address: "",
  restaurant_location_coverage: {
    longitude: "",
    latitude: "",
    coverage: 10,
  },
  minimum_order_value: 0,
  customer_verification: {
    status: 0,
    phone: 0,
    email: 0,
    firebase: 0,
  },
  base_urls: {
    product_image_url: "",
    customer_image_url: "",
    banner_image_url: "",
    category_image_url: "",
    category_banner_image_url: "",
    review_image_url: "",
    notification_image_url: "",
    restaurant_image_url: "",
    delivery_man_image_url: "",
    chat_image_url: "",
    promotional_url: "",
    kitchen_image_url: "",
    branch_image_url: "",
    gateway_image_url: "",
    payment_image_url: "",
    cuisine_image_url: "",
  },
  currency_symbol: "৳",
  delivery_management: {
    status: 0,
    min_shipping_charge: 0,
    shipping_per_km: 0,
  },
  branches: [],
  email_verification: false,
  phone_verification: false,
  currency_symbol_position: "left",
  country: "Bangladesh",
  self_pickup: false,
  delivery: false,
  play_store_config: {
    status: false,
    link: "",
    min_version: "",
  },
  app_store_config: {
    status: false,
    link: "",
    min_version: "",
  },
  social_media_link: [],
  software_version: "",
  decimal_point_settings: 0,
  schedule_order_slot_duration: 0,
  time_format: "",
  promotion_campaign: [],
  social_login: {
    google: 0,
    facebook: 0,
  },
  wallet_status: 0,
  loyalty_point_status: 0,
  ref_earning_status: 0,
  loyalty_point_item_purchase_point: 0,
  loyalty_point_exchange_rate: 0,
  loyalty_point_minimum_point: 0,
  whatsapp: {
    status: 0,
    number: "",
  },
  cookies_management: {
    status: 0,
    text: "",
  },
  toggle_dm_registration: 0,
  is_veg_non_veg_active: 0,
  otp_resend_time: 0,
  digital_payment_info: {
    digital_payment: "",
    plugin_payment_gateways: "",
    default_payment_gateways: "",
  },
  digital_payment_status: 0,
  active_payment_method_list: [],
  cash_on_delivery: "",
  digital_payment: "",
  offline_payment: "",
  guest_checkout: 0,
  partial_payment: 0,
  partial_payment_combine_with: "",
  add_fund_to_wallet: 0,
  apple_login: {
    login_medium: "",
    status: 0,
    client_id: "",
  },
  footer_copyright_text: "",
  customer_login: {
    login_option: {
      manual_login: 0,
      otp_login: 0,
      social_media_login: 0,
    },
    social_media_login_options: {
      google: 0,
      facebook: 0,
      apple: 0,
    },
  },
  google_map_status: 0,
  restaurant_open_time: null,
  restaurant_close_time: null,
  restaurant_schedule_time: [],
  restaurant_logo: "",
  cutlery_status: 0,
  firebase_otp_verification_status: 0,
  footer_description_text: "",
};

export default defaultConfig;
