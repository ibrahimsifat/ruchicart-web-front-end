import { api } from "@/lib/api/api";
import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [branches, categories] = await Promise.all([
      api.get("/api/v1/branches").then((res) => res.data),
      api.get("/api/v1/categories").then((res) => res.data),
    ]);

    const branchesRoutes = branches.map((branch: any) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/branches/${branch.id}`,
      lastModified: performance.now(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    const categoriesRoutes = categories.map((category: any) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/categories/${category.id}`,
      lastModified: performance.now(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const routes = ["", "/branches", "/categories", "/contact"].map(
      (route) => ({
        url: `${process.env.NEXT_PUBLIC_APP_URL}${route}`,
        lastModified: performance.now(),
        changeFrequency: "daily" as const,
        priority: 1,
      })
    );

    return [...routes, ...branchesRoutes, ...categoriesRoutes];
  } catch (error) {
    return [];
  }
}
