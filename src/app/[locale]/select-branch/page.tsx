"use client";

import { NearbyBranch } from "@/features/home/nearbyBranch";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SelectBranchPage() {
  const router = useRouter();
  const { currentLocation } = useLocationStore();
  const { currentBranch } = useBranchStore();

  useEffect(() => {
    if (!currentLocation) {
      router.push("/");
    }
  }, [currentLocation, router]);

  if (!currentLocation || currentBranch) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <NearbyBranch onBranchSelect={() => router.push("/")} />
      </main>
    </div>
  );
}
