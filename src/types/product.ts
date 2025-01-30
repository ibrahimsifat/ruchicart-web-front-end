export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  variations: Variation[];
  add_ons: any[];
  tax: number;
  available_time_starts: string;
  available_time_ends: string;
  status: number;
  created_at: string;
  updated_at: string;
  attributes: any[];
  category_ids: CategoryId[];
  choice_options: any[];
  discount: number;
  discount_type: "percent" | string;
  tax_type: "percent" | string;
  set_menu: number;
  branch_id: number;
  colors: null | string[];
  popularity_count: number;
  product_type: "veg" | string;
  is_recommended: number;
  branch_product: BranchProduct;
  rating: any[];
};

export type ProductResponse = {
  total_size: number;
  limit: number | null;
  offset: number;
  products: Product[];
};

interface Variation {
  name: string;
  type: string;
  min: string;
  max: string;
  required: string;
  values: VariationValue[];
}

interface VariationValue {
  label: string;
  optionPrice: string;
}

interface CategoryId {
  id: string;
  position: number;
}

interface BranchProduct {
  id: number;
  product_id: number;
  price: number;
  discount_type: string;
  discount: number;
  branch_id: number;
  is_available: number;
  variations: Variation[];
  created_at: string;
  updated_at: string;
  stock_type: string;
  stock: number;
  sold_quantity: number;
}
