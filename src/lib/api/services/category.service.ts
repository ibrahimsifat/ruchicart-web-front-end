import { Category } from "@/types";
import { fetcher } from "./api.service";

export async function getCategories() {
  return fetcher<Category[]>("/categories");
}
