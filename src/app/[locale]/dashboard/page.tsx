"use client";

import { AddressSection } from "@/features/dashboard/addressSection";
import { PersonalDetails } from "@/features/dashboard/personalDetails";
import { StatsCard } from "@/features/dashboard/statsCard";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";
import { Award, Heart, ShoppingBag, Wallet } from "lucide-react";

const mockUser = {
  name: "Mohammad Ibrahim Sifat",
  phone: "+966558845503",
  email: "ibsifat900@gmail.com",
  joinedDate: "Jan 26th 25",
  stats: {
    orders: 0,
    wallet: 0.0,
    loyaltyPoints: 0,
    wishlist: 0,
  },
};
export default function ProfilePage() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<ShoppingBag className="h-6 w-6 text-primary" />}
          value={user?.orders_count}
          label="Orders"
        />

        <StatsCard
          icon={<Wallet className="h-6 w-6 text-primary" />}
          value={`$${user?.wallet_balance}`}
          label="Amount In Wallet"
        />
        <StatsCard
          icon={<Award className="h-6 w-6 text-primary" />}
          value={mockUser.stats.loyaltyPoints}
          label="Loyalty Points"
        />
        <StatsCard
          icon={<Heart className="h-6 w-6 text-primary" />}
          value={user?.wishlist_count}
          label="Products In Wishlist"
        />
      </div>

      {/* Personal Details */}
      <PersonalDetails user={user as User} />

      {/* Address Section */}
      <AddressSection />
    </div>
  );
}
