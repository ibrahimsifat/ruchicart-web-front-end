import { Category } from "@/types";
import { Cuisine } from "@/types/cuisine";
import { fetcher } from "./api.service";

export async function getCategories() {
  return fetcher<Category[]>("/categories", {
    cache: {
      revalidate: 3600, // Revalidate every hour
      tags: ["categories"],
    },
  });
}

export async function getCuisines() {
  return fetcher<Cuisine[]>("/cuisine/list", {
    cache: {
      revalidate: 3600, // Revalidate every hour
      tags: ["cuisines"],
    },
  });
}
