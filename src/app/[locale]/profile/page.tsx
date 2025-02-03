import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { OrderHistoryItem } from "@/features/checkout/order-history-item";
import { AddressSection } from "@/features/profile/address-section";
import { PersonalDetails } from "@/features/profile/personal-details";
import { ProfileSidebar } from "@/features/profile/profile-sidebar";
import { StatsCard } from "@/features/profile/stats-card";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/store/authStore";
import { Award, Heart, ShoppingBag, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push(`/auth/login`);
    } else {
      fetchOrders();
    }
  }, [token, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order history");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch order history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
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
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderHistoryItem key={order.id} order={order} />
                      ))}
                    </div>
                  ) : (
                    <div>No orders found.</div>
                  )}
                </CardContent>
              </Card>
            </div>
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
