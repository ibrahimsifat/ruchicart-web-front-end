"use client";

import { NearbyBranch } from "@/features/branch/nearbyBranch";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { useRouter } from "next/navigation";
import PageLayout from "../layouts/PageLayout";

export default function SelectBranchPage() {
  const router = useRouter();
  const { currentLocation } = useLocationStore();
  const { currentBranch } = useBranchStore();

  // useEffect(() => {
  //   if (currentBranch) {
  //     router.push("/");
  //   }
  // }, [currentLocation, router]);

  // if (!currentLocation || currentBranch) {
  //   return null;
  // }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <main>
          <NearbyBranch />
        </main>
      </div>
    </PageLayout>
  );
}
