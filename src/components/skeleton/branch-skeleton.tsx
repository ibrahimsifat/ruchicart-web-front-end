import { memo } from "react";
import { Skeleton } from "../ui/skeleton";

export const BranchSkeleton = memo(() => (
  <div className="flex gap-4 rounded-lg border p-4">
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
));

export const LoadingList = memo(() => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <BranchSkeleton key={i} />
    ))}
  </>
));
