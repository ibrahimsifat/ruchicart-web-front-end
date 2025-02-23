"use client";

import { useProductAvailability } from "@/lib/hooks/product/useProductAvailability";
import { formatTime } from "@/lib/utils/date";
import { Clock } from "lucide-react";
import { memo } from "react";

interface ProductAvailabilityProps {
  startTime: string;
  endTime: string;
}

export const ProductAvailability = memo(
  ({ startTime, endTime }: ProductAvailabilityProps) => {
    const { isAvailable, timeUntilAvailable } = useProductAvailability(
      startTime,
      endTime
    );

    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-4 w-4 md:h-5 md:w-5" />
        {isAvailable ? (
          <div className="text-sm md:text-md text-green-500">
            Available until {formatTime(endTime)}
          </div>
        ) : (
          <div className="text-sm md:text-md text-red-500">
            Available {timeUntilAvailable}
          </div>
        )}
      </div>
    );
  }
);

ProductAvailability.displayName = "ProductAvailability";
