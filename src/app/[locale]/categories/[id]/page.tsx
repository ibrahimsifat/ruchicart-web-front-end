import { FilterSidebar } from "@/components/category/filter-sidebar";
import { ProductGrid } from "@/components/category/product-grid";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TopBar } from "@/components/layout/top-bar";
import ItemNotFound from "@/components/utils/itemNotFound";
import { getCategoryProducts } from "@/lib/hooks/queries/category/useCategories";

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const productResponse = await getCategoryProducts(id);
  const products = productResponse?.products;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* <CategoryHeader category={category} /> */}
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <FilterSidebar />
          {products?.length === 0 ? (
            <ItemNotFound />
          ) : (
            <ProductGrid products={products} />
          )}

          {/* <h1>{products?.length}</h1> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
