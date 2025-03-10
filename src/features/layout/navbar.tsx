"use client";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import { AnimatedCartIcon } from "@/components/ui/animated-cart-icon";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { SearchBar } from "@/features/search/searchBar";
import { useCategories } from "@/lib/hooks/queries/category/useCategories";
import { cn } from "@/lib/utils/utils";
import { useAuthStore } from "@/store/authStore";
import { ChevronDown, Heart, Loader2, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { CONSTANT } from "../../config/constants";
import MegaMenu from "./megaMenu";
import { MobileMenu } from "./mobileMenu";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const { data: categories } = useCategories();
  const { token } = useAuthStore();
  const t = useTranslations("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const memoizedCategories = useMemo(() => categories || [], [categories]);

  return (
    <>
      <nav
        className={cn(
          "border-b transition-opacity duration-500 bg-white",
          isSticky
            ? "fixed top-0 left-0 right-0 bg-primary shadow-sm z-50 "
            : ""
        )}
      >
        <div className="container mx-auto px-2 h-16 flex items-center justify-between gap-3">
          {/* Mobile Menu */}
          <MobileMenu categories={memoizedCategories} />

          {/* Logo */}
          <Link href="/" className="md:flex-shrink-0 sm:block hidden">
            <Image
              src={CONSTANT.images.logo}
              alt="Logo ruchicart"
              width={160}
              height={60}
              className="h-12 w-auto"
              priority // Prioritize logo loading
            />
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden lg:flex items-center gap-2 relative">
            <Button
              variant="ghost"
              className={cn("group", isMegaMenuOpen && "bg-primary text-white")}
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

          {/* Search with Live Results */}
          <Suspense fallback={<Loader2 className="h-5 w-5" />}>
            <SearchBar />
          </Suspense>

          {/* Right Section */}
          <div className="flex items-center gap-2 ">
            <div className="lg:flex hidden">
              <LocaleSwitcher />
              <Link href="/dashboard/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-8 w-8" />
                </Button>
              </Link>
            </div>
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowCartDrawer(true)}
            >
              <AnimatedCartIcon />
              {/* Pass itemCount to the icon */}
            </Button>

            {/* Sign In */}
            {token ? (
              <Suspense fallback={<Loader2 className="h-5 w-5" />}>
                <UserMenu />
              </Suspense>
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
      {isMegaMenuOpen && <MegaMenu categories={memoizedCategories} />}
      {/* Use categories */}
      <CartDrawer open={showCartDrawer} onOpenChange={setShowCartDrawer} />
    </>
  );
}
