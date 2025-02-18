"use client";

import { Badge } from "@/components/ui/badge";
import CustomImage from "@/components/ui/customImage";
import { cn } from "@/lib/utils/utils";
import { BaseBranch, BranchPromotionStatus } from "@/types/branch";
import { ImageType } from "@/types/image";
import { Clock, MapPin, Navigation, Phone, Star } from "lucide-react";
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
        "grid grid-cols-12 cursor-pointer gap-4 rounded-lg border p-4 transition-all hover:bg-accent",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={() => onSelect(branch)}
    >
      <div className="col-span-3 rounded-md overflow-hidden">
        <CustomImage
          type={ImageType.BRANCH}
          src={branch.image || "/placeholder.svg"}
          alt={branch.name}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="col-span-9 space-y-1 ">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg mb-2 truncate">{branch.name}</h3>
          <Badge variant="outline" className="text-primary">
            {branch.branch_promotion_status === BranchPromotionStatus.ENABLED
              ? "Promoted"
              : ""}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <p className="truncate">{branch.address}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="font-medium">4.5</span>
            <span className="text-muted-foreground ml-1">(500+)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{branch.preparation_time} mins</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-1" />
            <span>{branch.phone}</span>
          </div>
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
