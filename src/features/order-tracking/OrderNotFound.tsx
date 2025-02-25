import { Button } from "@/components/ui/button";

import { CardContent } from "@/components/ui/card";
import { CONSTANT } from "@/config/constants";

import { Card } from "@/components/ui/card";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
export const NoOrderFound = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-8  duration-300">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Image
            src={CONSTANT.images.notFound}
            width={250}
            height={250}
            alt="No Order Found"
            className="h-24 w-24 text-yellow-500 mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">No Order Found</h3>
          <p className="text-muted-foreground text-center mb-4">
            Please enter a valid order ID to track your order.
          </p>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
