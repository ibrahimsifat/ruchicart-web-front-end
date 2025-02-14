import { CardContent } from "@/components/ui/card";
import { Clock, CreditCard, Percent, Tag } from "lucide-react";

import { Card } from "@/components/ui/card";

const TrustBadges = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        {
          icon: Clock,
          title: "Express Delivery",
          description: "Within 30 mins",
        },
        {
          icon: Tag,
          title: "Best Price",
          description: "Guaranteed",
        },
        {
          icon: CreditCard,
          title: "Secure Payment",
          description: "100% Protected",
        },
        {
          icon: Percent,
          title: "Regular Offers",
          description: "Save up to 25%",
        },
      ].map((badge, index) => (
        <Card key={index} className="border-dashed">
          <CardContent className="p-4 text-center">
            <badge.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="font-medium text-sm">{badge.title}</div>
            <div className="text-xs text-muted-foreground">
              {badge.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrustBadges;
