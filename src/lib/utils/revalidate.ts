"use server";

import { revalidateTag } from "next/cache";

export async function revalidateTags() {
  const tagsToRevalidate = [
    "featured-products",
    "trending-products",
    "banners",
    "categories",
  ];

  // Revalidate all tags
  tagsToRevalidate.forEach((tag) => {
    revalidateTag(tag);
  });

  return {
    revalidated: true,
    timestamp: Date.now(),
    tags: tagsToRevalidate,
  };
}
