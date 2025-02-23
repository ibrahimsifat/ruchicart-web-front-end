import { Star } from "lucide-react";
import { memo } from "react";

interface ProductRatingProps {
  rating: number[];
}

export const ProductRating = memo(({ rating }: ProductRatingProps) => (
  <div className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded-full">
    <Star className="h-4 w-4 fill-primary text-primary-text" />
    <span className="text-sm font-medium text-primary-text">
      {rating.length > 0
        ? (rating.reduce((acc, curr) => acc + curr, 0) / rating.length).toFixed(
            1
          )
        : "N/A"}
    </span>
  </div>
));

ProductRating.displayName = "ProductRating";
