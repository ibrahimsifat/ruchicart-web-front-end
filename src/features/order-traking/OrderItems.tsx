import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { motion } from "framer-motion";

export const OrderItems = ({ orderStatus }) => {
  if (!orderStatus?.details || orderStatus.details.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-xl">Order Items</h3>
        <div className="p-6 text-center text-gray-500 bg-white rounded-lg">
          No items found in this order.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-xl">Order Items</h3>
      <div className="h-[300px] w-full rounded-md border p-4 overflow-y-auto">
        {orderStatus.details.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg  duration-300 mb-4"
          >
            {item.product_details?.image ? (
              <CustomImage
                type={ImageType.PRODUCT}
                src={item.product_details.image}
                alt={item.product_details.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold">
                {item.product_details?.name || "Unknown Item"}
              </h4>
              <p className="text-sm text-gray-500">
                {item.product_details?.description ||
                  "No description available"}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm">
                  Quantity: {item.quantity || "N/A"}
                </span>
                <span className="font-semibold">
                  ${item.price?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
