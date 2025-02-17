"use client";
import { formatTime } from "@/lib/utils/date";
import {
  getNextAvailableTime,
  isProductAvailable,
} from "@/lib/utils/product-availability";
import {
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
} from "date-fns";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

const ProductCardTimestamp = ({
  productStartTime,
  productEndTime,
}: {
  productStartTime: string;
  productEndTime: string;
}) => {
  // const formattedRange = formatTimeRange(productStartTime, productEndTime);
  const [isAvailable, setIsAvailable] = useState(false);
  const [timeUntilAvailable, setTimeUntilAvailable] = useState("");

  useEffect(() => {
    const checkAvailability = () => {
      const available = isProductAvailable(productStartTime, productEndTime);
      setIsAvailable(available);

      if (!available) {
        const nextAvailable = getNextAvailableTime(
          productStartTime,
          productEndTime
        );
        const now = new Date();

        // Calculate time difference
        const minutesDiff = differenceInMinutes(nextAvailable, now);
        const hoursDiff = differenceInHours(nextAvailable, now);

        // Format the time difference
        let timeUntil;
        if (hoursDiff < 1) {
          // If less than 1 hour, show minutes
          timeUntil = `in ${minutesDiff} minute${minutesDiff === 1 ? "" : "s"}`;
        } else {
          // If 1 hour or more, use formatDistanceToNow
          timeUntil = formatDistanceToNow(nextAvailable, {
            addSuffix: true,
          });
        }

        setTimeUntilAvailable(timeUntil);
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [productStartTime, productEndTime]);

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Clock className="h-4 w-4 md:h-5 md:w-5" />
      {isAvailable ? (
        <div className="text-sm md:text-md text-green-500">
          Available until {formatTime(productEndTime)}
        </div>
      ) : (
        <div className="text-sm md:text-md text-red-500">
          Available {timeUntilAvailable}
        </div>
      )}
    </div>
  );
};

export default ProductCardTimestamp;
