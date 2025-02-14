"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchById } from "@/lib/hooks/queries/Branch/useBranch";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Branch Information</span>
          <Badge variant={branch.status === 1 ? "success" : "secondary"}>
            {branch.status === 1 ? "Open Now" : "Closed"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <div className="font-medium">{branch.name}</div>
              <div className="text-sm text-muted-foreground">
                {branch.address}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Preparation Time: {branch.preparation_time} mins</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{branch.phone}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">4.5</span>
              <span className="text-sm text-muted-foreground">
                (2.3k reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <ThumbsUp className="h-4 w-4 text-primary" />
              <span>95% Positive</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Delivery available within {branch.coverage}km
          </div>
        </div>

        <Button className="w-full" variant="outline">
          View Branch Details
        </Button>
      </CardContent>
    </Card>
  );
}
