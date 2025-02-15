import { Button } from "@/components/ui/button";
import { ProductReview } from "@/features/order/product-review";
import { Star } from "lucide-react";

export const UserReviewDisplay = ({
  reviews,
  productId,
  userId,
  reviewingProductId,
  setReviewingProductId,
  orderId,
}: {
  reviews: Array<{
    product_id: number;
    user_id: number;
    comment: string;
    rating: number;
  }>;
  productId: number;
  userId: number;
  reviewingProductId: number | null;
  setReviewingProductId: (productId: number | null) => void;
  orderId: number;
}) => {
  const userReview = reviews?.find(
    (review) => review.product_id === productId && review.user_id === userId
  );

  if (!userReview) {
    return (
      <>
        {reviewingProductId === productId ? (
          <ProductReview
            productId={productId}
            orderId={orderId}
            onReviewSubmitted={() => setReviewingProductId(null)}
          />
        ) : (
          <Button onClick={() => setReviewingProductId(productId)}>
            Write a Review
          </Button>
        )}
      </>
    );
  }

  return (
    <div>
      <h3 className="text-md font-medium">Your Review</h3>
      <p className="text-sm text-muted-foreground">
        {userReview.comment}
        <div className="flex mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 cursor-pointer ${
                i + 1 <= userReview.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </p>
    </div>
  );
};

export default UserReviewDisplay;
