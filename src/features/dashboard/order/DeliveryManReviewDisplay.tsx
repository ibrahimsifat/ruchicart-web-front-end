import { Button } from "@/components/ui/button";
import { DeliveryManReview } from "@/features/order/dalivery-man-review";
import { Star } from "lucide-react";

interface Review {
  product_id: number;
  user_id: number;
  comment: string;
  rating: number;
  updated_at: string;
  created_at: string;
  delivery_man_id: number;
  order_id: number;
}
export const DeliveryManReviewDisplay = ({
  review,
  deliveryManId,
  userId,
  reviewingDeliveryManId,
  setReviewingDeliveryManId,
  orderId,
}: {
  review: Review | null;
  deliveryManId: number;
  userId: number;
  reviewingDeliveryManId: number | null;
  setReviewingDeliveryManId: (deliveryManId: number | null) => void;
  orderId: number;
}) => {
  console.log(deliveryManId, orderId);
  console.log(review);
  if (review === null) {
    return (
      <>
        {reviewingDeliveryManId === deliveryManId ? (
          <DeliveryManReview
            deliveryManId={deliveryManId}
            orderId={orderId}
            onReviewSubmitted={() => setReviewingDeliveryManId(null)}
          />
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setReviewingDeliveryManId(deliveryManId)}>
              Write a Review
            </Button>
          </div>
        )}
      </>
    );
  }
  const userReview = review.order_id == orderId && review.user_id == userId;
  console.log(userReview);
  if (userReview) {
    return (
      <div>
        <h3 className="text-md font-medium">Your Review</h3>
        <p className="text-sm text-muted-foreground">
          {review.comment}
          <div className="flex mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 cursor-pointer ${
                  i + 1 <= review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </p>
      </div>
    );
  }
  return (
    <div>
      <h3 className="text-md font-medium">Delivery Man Review</h3>
      <p>No review yet</p>
    </div>
  );
};

export default DeliveryManReviewDisplay;
