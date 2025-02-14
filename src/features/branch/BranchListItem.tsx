"use client";

import { Badge } from "@/components/ui/badge";
import CustomImage from "@/components/ui/customImage";
import { cn } from "@/lib/utils/utils";
import { BaseBranch } from "@/types/branch";
import { ImageType } from "@/types/image";
import { MapPin, Navigation } from "lucide-react";
import React from "react";
export const BranchListItem = React.memo(
  ({
    branch,
    isSelected,
    currentLocation,
    onSelect,
  }: {
    branch: BaseBranch;
    isSelected: boolean;
    currentLocation: { lat: number; lng: number } | null;
    onSelect: (branch: BaseBranch) => void;
  }) => (
    <div
      className={cn(
        "flex cursor-pointer gap-4 rounded-lg border p-4 transition-all hover:bg-accent",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={() => onSelect(branch)}
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
          <Badge variant={branch.preparation_time ? "success" : "secondary"}>
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
  )
);
BranchListItem.displayName = "BranchListItem";
