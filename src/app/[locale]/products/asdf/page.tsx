import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TopBar } from "@/components/layout/top-bar";
import { ProductDetails } from "@/components/product/product-details";
import { RelatedProducts } from "@/components/product/related-products";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";

async function getProductDetails(slug: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: "1",
    name: "FRIED RICE",
    description:
      "This Chinese-inspired fried rice recipe is my absolute fave. It's quick and easy to make, customizable with any of your favorite mix-ins, and perfect for using up leftover rice and veggies. Feel free to use any kind of rice that you prefer.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-80cXhc9uioyJlEnqkCPivuO9GiBLBk.png",
    rating: 0.0,
    restaurant: "The Capital Grill",
    price: 216.0,
    originalPrice: 240.0,
    options: [
      { name: "Half", price: 340.0 },
      { name: "Quarter", price: 440.0 },
      { name: "Full", price: 500.0 },
    ],
    nutritionInfo: {
      calories: "320 kcal",
      protein: "12g",
      carbs: "45g",
      fat: "14g",
    },
    ingredients: [
      "Rice",
      "Shrimp",
      "Mixed Vegetables",
      "Soy Sauce",
      "Sesame Oil",
      "Green Onions",
    ],
  };
}

async function getRelatedProducts() {
  return Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i + 2,
      name: `Related Dish ${i + 1}`,
      restaurant: "The Capital Grill",
      price: Math.floor(Math.random() * 20) + 15,
      image: "/placeholder.svg",
      rating: (Math.random() * 2 + 3).toFixed(1),
    }));
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProductDetails(id);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ProductDetails product={product} />
        <Separator className="my-16" />
        <RelatedProducts products={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
