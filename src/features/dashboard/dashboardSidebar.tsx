"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import {
  Award,
  Heart,
  LogOut,
  Mail,
  Settings,
  ShoppingBag,
  Ticket,
  User,
  Users,
  Wallet2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  {
    name: "My Profile",
    icon: User,
    path: "/dashboard",
  },
  {
    name: "Orders",
    icon: ShoppingBag,
    path: "/dashboard/orders",
  },
  {
    name: "Coupons",
    icon: Ticket,
    path: "/dashboard/coupons",
  },
  {
    name: "Wish List",
    icon: Heart,
    path: "/dashboard/wishlist",
  },
  {
    name: "Wallets",
    icon: Wallet2,
    path: "/dashboard/wallets",
  },
  {
    name: "Loyalty Points",
    icon: Award,
    path: "/dashboard/loyalty-points",
  },
  {
    name: "Referral Code",
    icon: Users,
    path: "/dashboard/referral",
  },
  {
    name: "Inbox",
    icon: Mail,
    path: "/dashboard/inbox",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Card className="w-64">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={user?.image}
              alt={`${user?.f_name} ${user?.l_name}`}
            />
            <AvatarFallback>
              {user?.f_name?.[0]}
              {user?.l_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user?.f_name} {user?.l_name}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-muted-foreground">{user?.phone}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Separator className="mb-4" />
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => router.push(item.path)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>
      </CardContent>
      <CardFooter className="p-4">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
