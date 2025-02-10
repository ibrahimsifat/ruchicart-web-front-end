"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/api";
import { calculateDistance } from "@/lib/utils/distance";
import { cn } from "@/lib/utils/utils";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { BaseBranch } from "@/types/branch";
import { ImageType } from "@/types/image";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

// Dynamically import the map component to avoid SSR issues
const BranchMap = dynamic(
  () => import("../location/branch-map").then((mod) => mod.BranchMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-lg bg-muted" />
    ),
  }
);

async function getBranches() {
  const res = await api.get("/branch/list");
  return res.data;
}

export function NearbyBranch() {
  const [selectedBranch, setSelectedBranch] = useState<BaseBranch | null>(null);
  const { toast } = useToast();
  const { currentLocation } = useLocationStore();
  const { currentBranch, setCurrentBranch } = useBranchStore();

  const { data: branchesData = [], isLoading } = useQuery({
    queryKey: ["branches", currentLocation],
    queryFn: getBranches,
    enabled: !!currentLocation,
  });

  // Calculate distances and sort branches by distance
  const branches = useMemo(() => {
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

  const handleBranchSelect = useCallback(
    async (branch: BaseBranch) => {
      try {
        const res = await api.post("/products/change-branch", {
          from_branch_id: currentBranch?.id,
          to_branch_id: branch.id,
          products: [
            {
              product_id: 2, // Must match an ID in product_ids
              quantity: 3,
              variations: [], // Include if product has variations
            },
          ], // Current cart products
          product_ids: [2], // Current cart product IDs
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
                    <div
                      key={branch.id}
                      className={cn(
                        "flex cursor-pointer gap-4 rounded-lg border p-4 transition-all hover:bg-accent",
                        (selectedBranch?.id === branch.id ||
                          currentBranch?.id === branch.id) &&
                          "border-primary bg-primary/5"
                      )}
                      onClick={() => handleBranchSelect(branch)}
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <CustomImage
                          type={ImageType.BRANCH}
                          src={branch.image || "/placeholder.svg"}
                          alt={branch.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{branch.name}</h3>
                        <p className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          {branch.address}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Preparation Time:
                          </span>
                          <Badge
                            variant={
                              branch.preparation_time ? "success" : "secondary"
                            }
                          >
                            {branch.preparation_time}
                          </Badge>
                          {currentLocation && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Navigation className="h-4 w-4" />
                              {branch.distance} km Away
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="h-[calc(100vh-12rem)] overflow-hidden">
          <BranchMap
            branches={branches}
            selectedBranch={selectedBranch || currentBranch}
            onBranchSelect={handleBranchSelect}
            currentLocation={currentLocation}
          />
        </Card>
      </div>
    </section>
  );
}
