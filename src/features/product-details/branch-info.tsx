"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchById } from "@/lib/hooks/queries/Branch/useBranch";
import { ImageType } from "@/types/image";
import { Clock, MapPin, Phone, Star, ThumbsUp } from "lucide-react";

interface BranchInfoProps {
  branchId: number;
}

export function BranchInfo({ branchId }: BranchInfoProps) {
  const { data: branch, isLoading } = useBranchById(branchId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!branch) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative p-0">
        <CustomImage
          type={ImageType.BRANCH}
          src={branch.cover_image}
          alt={branch.name}
          width={600}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-white rounded-full p-1 shadow-md">
          <CustomImage
            type={ImageType.BRANCH}
            src={branch.image}
            alt={branch.name}
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <CardTitle className="text-xl font-bold mb-2">
              {branch.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{branch.address}</span>
            </div>
          </div>
          <Badge variant={branch.status === 1 ? "success" : "destructive"}>
            {branch.status === 1 ? "Open" : "Closed"}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-2 text-primary-text" />
            <span>{branch.phone}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary-text" />
            <span>Prep time: {branch.preparation_time} mins</span>
          </div>
          {branch.distance && (
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-text" />
              <span>{branch.distance.toFixed(2)} km away</span>
            </div>
          )}
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-primary-text bg-primary/50" />
            <span>
              {branch.branch_promotion_status === 1
                ? "Promoted"
                : "Not Promoted"}
            </span>
          </div>
        </div>
        <div className="space-y-2 my-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">4.5</span>
              <span className="text-sm text-muted-foreground">
                (2.3k reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <ThumbsUp className="h-4 w-4 text-primary-text" />
              <span>95% Positive</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Delivery available within {branch.coverage}km
          </div>
        </div>

        <Button className="w-full" variant="default">
          View Branch Details
        </Button>
      </CardContent>
    </Card>
  );
}

function BranchInfoSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative p-0">
        <Skeleton className="w-full h-48" />
        <div className="absolute bottom-4 left-4 bg-white rounded-full p-1 shadow-md">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
