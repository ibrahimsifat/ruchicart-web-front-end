import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category } from "@/types";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export const MobileMenu = ({ categories }: { categories: Category[] }) => {
  return (
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
        <div className="my-4 space-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="flex items-center gap-2 py-2"
            >
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
        <LocaleSwitcher />
      </SheetContent>
    </Sheet>
  );
};
MobileMenu.displayName = "MobileMenu";
