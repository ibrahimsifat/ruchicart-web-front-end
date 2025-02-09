import { CONSTANT } from "@/config/constants";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: CONSTANT.locales,
  defaultLocale: CONSTANT.defaultLocale,
  pathnames: {
    "/": "/",
    "/products": "/products",
    "/products/:id": "/products/:id",
    "/categories": "/categories",
    "/categories/:id": "/categories/:id",
    "/deals": "/deals",
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
