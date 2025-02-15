import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "processing":
      case "confirmed":
        return "bg-blue-500";
      case "canceled":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};
