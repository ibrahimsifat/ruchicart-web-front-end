"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function OrderConfirmationSkeleton() {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl">
              <Skeleton className="h-20 w-20 rounded-full" />
            </CardTitle>
          </CardHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Card className="duration-300 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/10">
                <CardTitle className="flex justify-between items-center">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-8 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <Skeleton className="h-20 w-full" /> {/* OrderTimeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
                    <Skeleton className="h-40 w-full" /> {/* OrderDetails */}
                    <Skeleton className="h-40 w-full" /> {/* DeliveryInfo */}
                  </div>
                  <Skeleton className="h-60 w-full" /> {/* OrderItems */}
                  <Skeleton className="h-40 w-full" /> {/* BranchInfo */}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center">
              <Skeleton className="h-12 w-full max-w-md rounded-full" />
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}
