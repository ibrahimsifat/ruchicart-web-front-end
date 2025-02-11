"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/api";
import { calculateDistance } from "@/lib/utils/distance";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { BaseBranch } from "@/types/branch";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { BranchListItem } from "./BranchListItem";

// Separate loading component
const MapLoadingComponent = () => (
  <div className="h-full w-full animate-pulse rounded-lg bg-muted" />
);

// Map component with proper lazy loading
const BranchMap = React.lazy(() =>
  import("./branch-map").then((mod) => ({
    default: mod.BranchMap,
  }))
);

const getBranches = async () => {
  const res = await api.get("/branch/list");
  return res.data;
};

export function NearbyBranch() {
  const [selectedBranch, setSelectedBranch] = React.useState<BaseBranch | null>(
    null
  );
  const { toast } = useToast();
  const { currentLocation } = useLocationStore();
  const { currentBranch, setCurrentBranch } = useBranchStore();

  const { data: branchesData = [], isLoading } = useQuery({
    queryKey: ["branches", currentLocation],
    queryFn: getBranches,
    enabled: !!currentLocation,
  });

  const branches = React.useMemo(() => {
    if (!currentLocation) return branchesData;

    return branchesData
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

  const handleBranchSelect = React.useCallback(
    async (branch: BaseBranch) => {
      try {
        const res = await api.post("/products/change-branch", {
          from_branch_id: currentBranch?.id,
          to_branch_id: branch.id,
          products: [
            {
              product_id: 2,
              quantity: 3,
              variations: [],
            },
          ],
          product_ids: [2],
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

        // if (onBranchSelect) {
        //   onBranchSelect();
        // }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to change branch. Please try again.",
          variant: "destructive",
        });
      }
    },
    [currentBranch, setCurrentBranch, toast]
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
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4 rounded-lg border p-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  ))
                : branches.map((branch: BaseBranch) => (
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
                  ))}
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
