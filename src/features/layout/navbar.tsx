"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { SearchBar } from "@/features/search/searchBar";
import { useCategories } from "@/lib/hooks/queries/category/useCategories";
import { cn } from "@/lib/utils/utils";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/store/cartStore";
import {
  ChevronDown,
  LogIn,
  LogOut,
  MenuIcon,
  ShoppingBag,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import LocaleSwitcher from "../../components/LocaleSwitcher";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { CONSTANT } from "../../config/constants";
import MegaMenu from "./megaMenu";

export const CartIconRef =
  React.createContext<React.RefObject<HTMLButtonElement | null> | null>(null);

export function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const { data: categories } = useCategories();
  const { itemCount } = useCart();
  const { token, getProfileInfo } = useAuthStore();
  const t = useTranslations("home");

  useEffect(() => {
    if (token) {
      getProfileInfo();
    }
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CartIconRef.Provider value={cartIconRef}>
      <nav
        className={cn(
          "border-b transition-opacity duration-500 ",
          isSticky
            ? "fixed top-0 left-0 right-0 bg-yellow-300 shadow-sm z-50 "
            : ""
        )}
      >
        <div className="container mx-auto px-2 h-16 flex items-center justify-between gap-3">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {categories?.map((category) => (
                  <Link
                    key={category.name}
                    href={`/categories/${category.id}`}
                    className="flex items-center gap-2 py-2"
                  >
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={CONSTANT.images.logo}
              alt="Logo"
              width={160}
              height={60}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden md:flex items-center gap-2 relative group">
            <div className="hidden md:flex items-center gap-2 relative">
              <Button
                variant="ghost"
                className={`group ${isMegaMenuOpen && "bg-primary text-white"}`}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                {t("categories")}
                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 transition-transform",
                    isMegaMenuOpen && "rotate-180"
                  )}
                />
              </Button>
            </div>

            <Link href="/deals" className="text-sm font-medium">
              {t("deals")}
            </Link>
          </div>

          {/* Search with Live Results */}
          <SearchBar />

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LocaleSwitcher />
            {/* Cart */}
            <Button
              ref={cartIconRef}
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowCartDrawer(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
            {/* Sign In */}
            {token ? (
              <UserMenu />
            ) : (
              <Link href="/auth/login">
                <Button className="hidden md:inline-flex">
                  {t("signIn")}
                  <LogIn className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
      {/* Category Mega Menu */}
      {isMegaMenuOpen && (
        <MegaMenu categories={categories || []} isSticky={isSticky} />
      )}

      <CartDrawer open={showCartDrawer} onOpenChange={setShowCartDrawer} />
    </CartIconRef.Provider>
  );
}
const UserMenu = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const t = useTranslations("home");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hidden md:flex items-center gap-2 p-1 px-2 hover:bg-primary/10"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user?.f_name} />
            <AvatarFallback>{user?.f_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium leading-none">
              {user?.f_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("personal")}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <Link href="/dashboard">{t("profile")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <Link href="/dashboard/orders">{t("orders")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
