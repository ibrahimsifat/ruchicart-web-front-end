import { Star } from "lucide-react";

export const ProductReviewDisplay = ({
  average,
  count,
}: {
  average: number;
  count: number;
}) => {
  const getStarDisplay = (position: number) => {
    if (position + 1 <= average) {
      // Full star
      return "text-yellow-400 fill-yellow-400";
    } else if (position + 0.5 <= average) {
      // Half star
      return "half-star";
    } else {
      // Empty star
      return "text-gray-300";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-4xl font-bold">{average}</div>
      <div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => {
            const starClass = getStarDisplay(i);
            if (starClass === "half-star") {
              return (
                <div key={i} className="relative">
                  <Star
                    className="absolute text-yellow-400 fill-yellow-400"
                    style={{ clipPath: "inset(0 50% 0 0)" }}
                  />
                  <Star className="text-gray-300" />
                </div>
              );
            }
            return <Star key={i} className={`h-5 w-5 ${starClass}`} />;
          })}
        </div>
        <p className="text-sm text-muted-foreground">{count} reviews</p>
      </div>
    </div>
  );
};

export default ProductReviewDisplay;
