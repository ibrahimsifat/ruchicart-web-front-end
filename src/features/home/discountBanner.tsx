"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { useLatestProducts } from "@/lib/hooks/queries/product/useProducts";
import { calculateTimeLeft } from "@/lib/utils/date";
import { ImageType } from "@/types/image";
import { Product } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// TimerUnit component
const TimerUnit = memo(
  ({ value, interval }: { value: number; interval: string }) => (
    <div className="flex flex-col items-center bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs md:text-sm uppercase text-primary-text">
        {interval}
      </span>
    </div>
  )
);

TimerUnit.displayName = "TimerUnit";

// ProductInfo component
const ProductInfo = memo(({ product }: { product?: Product }) => (
  <div className="space-y-4 text-center md:text-left z-10">
    <motion.h2
      className="text-3xl md:text-4xl lg:text-5xl font-bold"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {product?.name}
    </motion.h2>
    <motion.p
      className="text-lg md:text-xl lg:text-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Savor our {product?.name} with a mouthwatering{" "}
      <span className="font-bold text-primary">20% OFF</span>
    </motion.p>
  </div>
));

ProductInfo.displayName = "ProductInfo";

// Calculate time left function optimized with useMemo

export function DiscountBanner() {
  const [now, setNow] = useState(() => Date.now());
  const { data } = useLatestProducts();
  const promotionalProduct: Product | undefined = data?.products[2];

  // target date
  const TARGET_DATE = useMemo(() => "2025-03-01", []);

  // time left calculation
  const timeLeft = useMemo(
    () => calculateTimeLeft(TARGET_DATE),
    [TARGET_DATE, now]
  );

  // Use RAF for smoother updates
  useEffect(() => {
    let frameId: number;

    const updateTimer = () => {
      setNow(Date.now());
      frameId = requestAnimationFrame(updateTimer);
    };

    frameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  // timer components generation
  const timerComponents = useMemo(() => {
    if (!timeLeft) return null;

    return Object.entries(timeLeft).map(([interval, value]) => (
      <TimerUnit key={interval} value={value} interval={interval} />
    ));
  }, [timeLeft]);

  const [showPreview, setShowPreview] = useState(false);
  const handleOrderClick = useCallback(() => {
    // Handle order click logic here
  }, []);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-[#C3F1FF] to-[#E8F9FF] text-primary-text">
      <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 lg:p-12">
        <div className="space-y-4">
          <ProductInfo product={promotionalProduct} />
          <motion.div
            className="flex flex-col items-center md:items-start space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Offer Ends In:</span>
            </div>
            <div className="flex justify-center md:justify-start space-x-4">
              {timerComponents || (
                <span className="text-2xl font-bold">Offer Expired!</span>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              size="lg"
              variant="default"
              className="mt-4 text-primary-text hover:bg-primary-light"
              onClick={handleOrderClick}
            >
              Order Now
            </Button>
          </motion.div>
        </div>
        {promotionalProduct && (
          <motion.div
            className="relative w-full md:w-1/2 h-48 md:h-64 lg:h-80 mt-6 md:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CustomImage
              type={ImageType.PRODUCT}
              src={promotionalProduct.image}
              alt={promotionalProduct.name}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        )}
      </div>
    </Card>
  );
}
