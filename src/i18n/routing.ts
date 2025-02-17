import { CONSTANT } from "@/config/constants";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: CONSTANT.locales,
  defaultLocale: CONSTANT.defaultLocale,
  pathnames: {
    "/": "/",
    "/products": "/products",
    "/categories": "/categories",
    "/deals": "/deals",
    "/select-branch": "/select-branch",
    "/enable-location": "/enable-location",
    "/no-internet": "/no-internet",
    "/about-us": "/about-us",
    "/dashboard/wallet": "/dashboard/wallet",
    "/dashboard/loyalty-points": "/dashboard/loyalty-points",
    "/wishlist": "/wishlist",
    "/order-tracking": "/order-tracking",
    "/privacy-policy": "/privacy-policy",
    "/terms-and-conditions": "/terms-and-conditions",
    "/refund-policy": "/refund-policy",
    "/cancellation-policy": "/cancellation-policy",
    "/dashboard": "/dashboard",
    "/become-a-delivery-man": "/become-a-delivery-man",
    "#": "#",
    "/pathnames": {
      en: "/pathnames",
      bn: "/pfadnamen",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
