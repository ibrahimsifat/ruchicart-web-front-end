import { Product } from "./product";

export interface BannerItem {
  id: number;
  title: string;
  image: string;
  product_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  category_id: number | null;
  product: Product;
}
