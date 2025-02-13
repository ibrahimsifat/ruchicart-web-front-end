"use client";

import { LoadingList } from "@/components/skeleton/branch-skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/api";
import { useBranch } from "@/lib/hooks/queries/Branch/useBranch";
import { calculateDistance } from "@/lib/utils/distance";
import { useBranchStore } from "@/store/branchStore";
import { useCart } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { BaseBranch } from "@/types/branch";
import React, { memo, Suspense, useCallback, useMemo, useState } from "react";
import { BranchListItem } from "./BranchListItem";

// Separate loading component
const MapLoadingComponent = memo(() => (
  <div className="h-full w-full animate-pulse rounded-lg bg-muted" />
));

// Map component with proper lazy loading and prefetching
const BranchMap = memo(
  React.lazy(() => {
    const promise = import("./branch-map").then((mod) => ({
      default: memo(mod.BranchMap),
    }));
    // Trigger prefetch
    import("./branch-map");
    return promise;
  })
);

export function NearbyBranch() {
  const [selectedBranch, setSelectedBranch] = useState<BaseBranch | null>(null);
  const { toast } = useToast();
  const { currentLocation } = useLocationStore();
  const { currentBranch, setCurrentBranch } = useBranchStore();
  const { items } = useCart();
  const { data: branchesData = [], isLoading } = useBranch();

  // Memoized branches calculation
  const branches = useMemo(() => {
    if (!currentLocation || !branchesData.length) return branchesData;

    return [...branchesData]
      .map((branch: BaseBranch) => ({
        ...branch,
        distance: calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          Number(branch.latitude),
          Number(branch.longitude)
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [branchesData, currentLocation]);

  // Optimized branch selection handler
  const handleBranchSelect = useCallback(
    async (branch: BaseBranch) => {
      if (branch.id === currentBranch?.id) return;

      try {
        const res = await api.post("/products/change-branch", {
          from_branch_id: currentBranch?.id,
          to_branch_id: branch.id,
          products: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            variations: item.variations,
          })),
          product_ids: items.map((item) => item.id),
        });

        if (res.status !== 200) {
          throw new Error("Failed to change branch");
        }

        setSelectedBranch(branch);
        setCurrentBranch(branch as any);
        toast({
          title: "Branch Changed",
          description: `Successfully switched to ${branch.name}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to change branch. Please try again.",
          variant: "destructive",
        });
      }
    },
    [currentBranch?.id, setCurrentBranch, toast]
  );

  return (
    <section className="container py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Select Branch</h2>
        <p className="text-muted-foreground">
          Choose a branch near you for delivery or pickup
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]">
        <Card className="h-[calc(100vh-12rem)] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {isLoading ? (
                <LoadingList />
              ) : (
                branches.map((branch: BaseBranch) => (
                  <BranchListItem
                    key={branch.id}
                    branch={branch}
                    isSelected={
                      selectedBranch?.id === branch.id ||
                      currentBranch?.id === branch.id
                    }
                    currentLocation={currentLocation}
                    onSelect={handleBranchSelect}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        <Card className="h-[calc(100vh-12rem)] overflow-hidden">
          <Suspense fallback={<MapLoadingComponent />}>
            <BranchMap
              branches={branches}
              selectedBranch={selectedBranch || currentBranch}
              onBranchSelect={handleBranchSelect}
              currentLocation={currentLocation}
            />
          </Suspense>
        </Card>
      </div>
    </section>
  );
}
