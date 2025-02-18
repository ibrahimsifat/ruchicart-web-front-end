import { Product } from "@/types/product";
import { Star } from "lucide-react";

const ProductCardRating = ({ product }: { product: Product }) => {
  return (
    <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
      <Star className="h-4 w-4 fill-primary text-primary-text" />
      <span className="text-sm font-medium text-primary-text">
        {product.rating.length > 0
          ? (
              product.rating.reduce((acc, curr) => acc + curr, 0) /
              product.rating.length
            ).toFixed(1)
          : "N/A"}
      </span>
    </div>
  );
};

export default ProductCardRating;
