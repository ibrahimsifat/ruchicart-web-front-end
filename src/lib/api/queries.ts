import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  user: {
    info: ["user"] as const,
  },
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
    related: (productId: number) => ["relatedProducts", productId] as const,
    // infinite: (filters: any) => ["products", "infinite", filters] as const,
  },
  banners: {
    all: ["banners"] as const,
  },
  branches: {
    all: ["branches"] as const,
    byId: (id: number) => ["branches", id] as const,
  },
  orders: {
    details: (order_id: string) => ["orders", order_id] as const,
    track: (order_id: string | null) => ["orders", order_id, "track"] as const,
    list: ["orders"] as const,
  },
  coupons: {
    all: ["coupons"] as const,
  },
  cuisines: {
    all: ["cuisines"] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    byId: (id: number) => ["reviews", id] as const,
  },
  rating: {
    all: ["rating"] as const,
    byId: (id: number) => ["rating", id] as const,
  },
} as const;

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });
};

let client: QueryClient | undefined;

export const getQueryClient = () => {
  if (!client) client = createQueryClient();
  return client;
};
