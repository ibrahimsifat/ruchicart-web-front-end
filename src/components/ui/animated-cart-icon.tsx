"use client";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cartStore";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function AnimatedCartIcon() {
  const { itemCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <div className="relative">
      <ShoppingCartIcon className="h-7 w-7 font-bold" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            key="badge"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute -top-2 -right-2"
          >
            <Badge
              variant="destructive"
              className="h-5 w-5 p-0 flex items-center justify-center rounded-full"
            >
              {itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="pulse"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
