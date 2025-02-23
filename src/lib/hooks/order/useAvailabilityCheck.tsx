import { isProductAvailable } from "@/lib/utils/product-availability";

import { useEffect } from "react";

import { useState } from "react";

export const useAvailabilityCheck = (items: any[]) => {
  const [unavailableItems, setUnavailableItems] = useState<string[]>([]);

  useEffect(() => {
    const checkAvailability = () => {
      const unavailable = items
        .filter(
          (item) =>
            !isProductAvailable(
              item.available_time_starts || "",
              item.available_time_ends || ""
            )
        )
        .map((item) => item.name);
      setUnavailableItems(unavailable);
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000);
    return () => clearInterval(interval);
  }, [items]);

  return unavailableItems;
};

useAvailabilityCheck.displayName = "useAvailabilityCheck";
