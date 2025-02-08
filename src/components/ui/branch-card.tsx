import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BranchPromotionStatus, type BaseBranch } from "@/types/branch";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BranchCardProps {
  branch: BaseBranch;
}

export function BranchCard({ branch }: BranchCardProps) {
  return (
    <Link href={`/branch/${branch.id}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="relative h-48">
          <Image
            src={branch.cover_image || "/placeholder.svg"}
            alt={branch.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {branch.branch_promotion_status === BranchPromotionStatus.ENABLED && (
            <Badge className="absolute top-4 right-4 bg-primary">
              Promoted
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{branch.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {branch.address}
              </p>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Phone className="h-4 w-4 mr-1" />
                {branch.phone}
              </p>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                {branch.preparation_time} mins prep time
              </p>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">4.5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
