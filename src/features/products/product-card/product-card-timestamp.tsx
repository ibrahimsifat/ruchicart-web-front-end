"use client";
import { formatTimeRange } from "@/lib/utils/date";
import { Clock } from "lucide-react";

const ProductCardTimestamp = ({
  productStartTime,
  productEndTime,
}: {
  productStartTime: string;
  productEndTime: string;
}) => {
  const formattedRange = formatTimeRange(productStartTime, productEndTime);

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Clock className="h-4 w-4" />

      <span>{formattedRange}</span>
    </div>
  );
};

export default ProductCardTimestamp;
