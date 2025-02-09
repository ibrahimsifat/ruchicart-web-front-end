import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="aspect-square">
              <Skeleton className="w-full h-full" />
            </Card>
          ))}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </Card>
  );
}

export function BranchCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </Card>
  );
}

export function PromoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center p-6">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-1/3" />
        </div>
        <Skeleton className="h-32 w-32 rounded-lg" />
      </div>
    </Card>
  );
}

export function DiscountBannerSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-48 w-48 rounded-lg" />
      </div>
    </Card>
  );
}

export function AppDownloadSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-8 md:p-12">
      <Skeleton className="h-[600px] rounded-2xl" />
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
    </div>
  );
}
