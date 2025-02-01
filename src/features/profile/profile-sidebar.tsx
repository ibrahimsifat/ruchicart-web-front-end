"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ShoppingBag, Ticket, Heart, Wallet2, Award, Users, Mail, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "My Profile",
    icon: User,
    href: "/profile",
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    href: "/profile/orders",
  },
  {
    title: "Coupons",
    icon: Ticket,
    href: "/profile/coupons",
  },
  {
    title: "Wish List",
    icon: Heart,
    href: "/profile/wishlist",
  },
  {
    title: "Wallets",
    icon: Wallet2,
    href: "/profile/wallets",
  },
  {
    title: "Loyalty Points",
    icon: Award,
    href: "/profile/loyalty-points",
  },
  {
    title: "Referral Code",
    icon: Users,
    href: "/profile/referral",
  },
  {
    title: "Inbox",
    icon: Mail,
    href: "/profile/inbox",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/profile/settings",
  },
]

export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 space-y-1">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}

