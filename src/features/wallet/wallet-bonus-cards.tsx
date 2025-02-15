import { Card, CardContent } from "@/components/ui/card";
import type { WalletBonus } from "@/types/wallet";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

interface WalletBonusCardsProps {
  bonuses: WalletBonus[];
}

export function WalletBonusCards({ bonuses }: WalletBonusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bonuses.map((bonus, index) => (
        <motion.div
          key={bonus.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-accent overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{bonus.bonus_title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Add minimum ${bonus.minimum_add_amount} and get $
                    {bonus.bonus_amount} bonus
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gift className="h-4 w-4 text-primary" />
                    <span>Max bonus: ${bonus.maximum_bonus_amount}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Valid till {format(new Date(bonus.end_date), "PP")}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
