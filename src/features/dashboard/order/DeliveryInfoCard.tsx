import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { Separator } from "@/components/ui/separator";
import DeliveryManReviewDisplay from "@/features/dashboard/order/DeliveryManReviewDisplay";
import { ImageType } from "@/types/image";
import { MapPin, Phone, User } from "lucide-react";

interface DeliveryInfoCardProps {
  order: any;
  user: any;
  reviewingDeliveryManId: number | null;
  setReviewingDeliveryManId: (id: number | null) => void;
}

export const DeliveryInfoCard = ({
  order,
  user,
  reviewingDeliveryManId,
  setReviewingDeliveryManId,
}: DeliveryInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Delivery Address</p>
            <p className="text-sm text-muted-foreground">
              {order.delivery_address
                ? JSON.parse(order.delivery_address).address
                : "Address not available"}
            </p>
          </div>
        </div>

        {order.delivery_address && (
          <>
            <div className="flex items-start gap-4">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Contact Person</p>
                <p className="text-sm text-muted-foreground">
                  {JSON.parse(order.delivery_address).contact_person_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Contact Number</p>
                <p className="text-sm text-muted-foreground">
                  {JSON.parse(order.delivery_address).contact_person_number}
                </p>
              </div>
            </div>
          </>
        )}

        {order.delivery_man && (
          <>
            <Separator />
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <CustomImage
                  type={ImageType.DELIVERY_MAN}
                  src={order.delivery_man.image || "/placeholder.svg"}
                  alt="Delivery Person"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">
                  {order.delivery_man.f_name} {order.delivery_man.l_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Delivery Partner
                </p>
              </div>
              <Button variant="outline" className="ml-auto">
                <Phone className="h-4 w-4 mr-2" />
                <a href={`tel:${order.delivery_man.phone}`}>Call</a>
              </Button>
            </div>
            {order.order_status === "delivered" && (
              <DeliveryManReviewDisplay
                review={order.deliveryman_review || null}
                deliveryManId={order.delivery_man.id}
                userId={user?.id || 0}
                reviewingDeliveryManId={reviewingDeliveryManId}
                setReviewingDeliveryManId={setReviewingDeliveryManId}
                orderId={order.id}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
