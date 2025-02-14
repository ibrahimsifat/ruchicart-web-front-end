import { Category } from "@/types";
import { Cuisine } from "@/types/cuisine";
import { fetcher } from "./api.service";

export async function getCategories() {
  return fetcher<Category[]>("/categories");
}

export async function getCuisines() {
  return fetcher<Cuisine[]>("/cuisine/list");
}
