import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { motion } from "framer-motion";

interface OrderItemsCardProps {
  orderDetails: any[];
}

export const OrderItemsCard = ({ orderDetails }: OrderItemsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orderDetails.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                <CustomImage
                  type={ImageType.PRODUCT}
                  src={`${item.product_details.image}` || "/placeholder.svg"}
                  alt={item.product_details.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.product_details.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                {item.add_on_ids.length > 0 && (
                  <div className="mt-1">
                    <p className="text-sm font-medium">Add-ons:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.add_on_ids.map((addonId, idx) => (
                        <Badge key={idx} variant="secondary">
                          {addonId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price.toFixed(2)}</p>
                {item.discount_on_product > 0 && (
                  <p className="text-sm text-muted-foreground">
                    -${item.discount_on_product.toFixed(2)} discount
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
