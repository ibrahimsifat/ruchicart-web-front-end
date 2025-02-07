"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { LogOut, ShoppingBag, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  Award,
  Heart,
  Mail,
  Settings,
  Ticket,
  Users,
  Wallet2,
} from "lucide-react";

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
    <div className="w-64 bg-white shadow-md rounded-lg p-6 space-y-6">
      <div className="flex flex-col items-center space-y-4">
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
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-sm text-muted-foreground">{user?.phone}</p>

          <p className="text-xs text-muted-foreground">
            Joined {user?.created_at}
          </p>
        </div>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={pathname === item.path ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push(item.path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>
      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
