import { CategoryHeader } from "@/features/category/category-header";
import { FilterSidebar } from "@/features/category/filter-sidebar";
import { ProductGrid } from "@/features/category/product-grid";
import { Footer } from "@/features/layout/footer";
import { Navbar } from "@/features/layout/navbar";
import { TopBar } from "@/features/layout/top-bar";
import { notFound } from "next/navigation";

async function getCategoryDetails(id: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const categories = {
    pizza: {
      name: "Pizza",
      description: "Delicious pizzas from top restaurants",
    },
    burger: { name: "Burger", description: "Juicy burgers for every taste" },
    sushi: { name: "Sushi", description: "Fresh and authentic sushi dishes" },
  };
  return categories[id as keyof typeof categories] || null;
}

async function getProducts(id: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: `${id.charAt(0).toUpperCase() + id.slice(1)} ${i + 1}`,
      restaurant: `Restaurant ${i + 1}`,
      price: Math.floor(Math.random() * 20) + 10,
      image: "/placeholder.svg",
      rating: (Math.random() * 2 + 3).toFixed(1),
      deliveryTime: `${Math.floor(Math.random() * 20) + 20}-${
        Math.floor(Math.random() * 20) + 40
      }`,
    }));
}

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const category = await getCategoryDetails(id);
  if (!category) notFound();

  const products = await getProducts(id);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <CategoryHeader category={category} />
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <FilterSidebar />
          <ProductGrid products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * // app/(marketing)/page.tsx
import { getQueryClient } from '../../lib/react-query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import DataTable from '../../components/DataTable';

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('https://jsonplaceholder.typicode.com/todos').then((res) => res.json()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DataTable />
    </HydrationBoundary>
  );
}
 */
