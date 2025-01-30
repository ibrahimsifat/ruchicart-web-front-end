"use client";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategories } from "@/lib/hooks/queries/category/useCategories";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { ImageType } from "@/types/image";
import { ChevronDown, MenuIcon, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { CONSTANT } from "../../config/constants";
import LocaleSwitcher from "../LocaleSwitcher";
import { Card } from "../ui/card";
import CustomImage from "../ui/customImage";
import { getCategoryBGGradient } from "../utils/getCategoryBGGradient";
import { SearchBar } from "./search-bar";

export const CartIconRef =
  React.createContext<React.RefObject<HTMLButtonElement> | null>(null);

export function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const { data: categories, isLoading, error } = useCategories();

  const { itemCount } = useCart();

  useEffect(() => {
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
                Categories{" "}
                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 transition-transform",
                    isMegaMenuOpen && "rotate-180"
                  )}
                />
              </Button>
            </div>

            <Link href="/deals" className="text-sm font-medium">
              Offers
            </Link>
          </div>

          {/* Search with Live Results */}
          <SearchBar />

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  {/* Show the opposite language flag */}
                  <Image
                    src="/bd-flag.png"
                    alt="Bangla"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="font-medium">বাংলা</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Image
                    src="/us-flag.png"
                    alt="English"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Image
                    src="/bd-flag.png"
                    alt="Bangla"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span>বাংলা</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Button className="hidden md:inline-flex"></Button>
            <Link href="/auth/login"> Sign In</Link>
          </div>
        </div>
      </nav>
      {/* Category Mega Menu */}
      {isMegaMenuOpen && (
        <div className="absolute left-0 w-full bg-white shadow-lg z-40 py-4 border-t">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {categories?.map((category) => (
                <Link key={category.name} href={`/categories/${category.id}`}>
                  <Card
                    key={category.name}
                    className={cn(
                      "group transition-all duration-500 cursor-pointer overflow-hidden",

                      getCategoryBGGradient(),
                      isSticky ? "rounded-full scale-50" : "rounded-lg"
                    )}
                  >
                    <div
                      className={cn(
                        "p-4 flex flex-col items-center justify-center aspect-square transition-all duration-500",
                        isSticky && "scale-100 p-0"
                      )}
                    >
                      <CustomImage
                        src={category.image}
                        type={ImageType.CATEGORY}
                        width={200}
                        height={200}
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-300",
                          isSticky ? "scale-100" : "mb-2"
                        )}
                        alt={`${category.name} category`}
                      />
                      {!isSticky && (
                        <span
                          className={cn(
                            "font-medium md:text-md text-sm text-center group-hover:font-bold transition-all duration-300 h-9"
                          )}
                        >
                          {category.name}
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={showCartDrawer} onOpenChange={setShowCartDrawer} />
    </CartIconRef.Provider>
  );
}
