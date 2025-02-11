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
