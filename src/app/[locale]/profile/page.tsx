import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddressSection } from "@/features/profile/address-section";
import { PersonalDetails } from "@/features/profile/personal-details";
import { ProfileSidebar } from "@/features/profile/profile-sidebar";
import { StatsCard } from "@/features/profile/stats-card";
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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt={mockUser.name} />
              <AvatarFallback>
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{mockUser.name}</h2>
              <p className="text-sm text-muted-foreground">{mockUser.phone}</p>
              <p className="text-xs text-muted-foreground">
                Joined {mockUser.joinedDate}
              </p>
            </div>
          </div>
          <ProfileSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={<ShoppingBag className="h-6 w-6 text-primary" />}
              value={mockUser.stats.orders}
              label="Orders"
            />
            <StatsCard
              icon={<Wallet className="h-6 w-6 text-primary" />}
              value={`$${mockUser.stats.wallet.toFixed(2)}`}
              label="Amount In Wallet"
            />
            <StatsCard
              icon={<Award className="h-6 w-6 text-primary" />}
              value={mockUser.stats.loyaltyPoints}
              label="Loyalty Points"
            />
            <StatsCard
              icon={<Heart className="h-6 w-6 text-primary" />}
              value={mockUser.stats.wishlist}
              label="Products In Wishlist"
            />
          </div>

          {/* Personal Details */}
          <PersonalDetails user={mockUser} />

          {/* Address Section */}
          <AddressSection />
        </div>
      </div>
    </div>
  );
}
