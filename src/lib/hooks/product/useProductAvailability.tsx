import {
  getNextAvailableTime,
  isProductAvailable,
} from "@/lib/utils/product-availability";
import {
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
} from "date-fns";
import { useEffect, useState } from "react";

export const useProductAvailability = (startTime: string, endTime: string) => {
  const [availability, setAvailability] = useState({
    isAvailable: false,
    timeUntilAvailable: "",
  });

  useEffect(() => {
    const checkAvailability = () => {
      const available = isProductAvailable(startTime, endTime);

      if (available) {
        setAvailability({ isAvailable: true, timeUntilAvailable: "" });
        return;
      }

      const nextAvailable = getNextAvailableTime(startTime, endTime);
      const now = new Date();
      const minutesDiff = differenceInMinutes(nextAvailable, now);
      const hoursDiff = differenceInHours(nextAvailable, now);

      const timeUntil =
        hoursDiff < 1
          ? `in ${minutesDiff} minute${minutesDiff === 1 ? "" : "s"}`
          : formatDistanceToNow(nextAvailable, { addSuffix: true });

      setAvailability({ isAvailable: false, timeUntilAvailable: timeUntil });
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return availability;
};
