import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    byId: (id: string) => ["categories", id] as const,
    detail: (id: string | number) => ["categories", id] as const,
    // infinite: (filters: any) => ["categories", "infinite", filters] as const,
  },
  products: {
    all: ["products"] as const,
    byId: (id: string) => ["products", id] as const,
    popular: ["popularProducts"] as const,
    detail: (id: string | number) => ["products", id] as const,
    latest: ["latestProducts"] as const,
    branch: ["branchProducts"] as const,
    // infinite: (filters: any) => ["products", "infinite", filters] as const,
  },
  banners: {
    all: ["banners"] as const,
  },
  branches: {
    all: ["branches"] as const,
  },
} as const;

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });
};

let client: QueryClient | undefined;

export const getQueryClient = () => {
  if (!client) client = createQueryClient();
  return client;
};
