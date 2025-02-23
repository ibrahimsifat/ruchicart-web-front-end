import { cn } from "@/lib/utils/utils";
import { Heart } from "lucide-react";
import { memo } from "react";

interface WishlistButtonProps {
  isWishListed: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const WishlistButton = memo(
  ({ isWishListed, onClick }: WishlistButtonProps) => (
    <button
      onClick={onClick}
      className={cn(
        "absolute -top-6 right-0 z-10 rounded-full p-1.5 bg-white/80 backdrop-blur-sm",
        "transition-all duration-300 hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1",
        isWishListed
          ? "text-red-500 hover:text-red-600"
          : "text-gray-600 hover:text-gray-900"
      )}
    >
      <Heart
        className={cn("h-5 w-5", isWishListed ? "fill-current" : "fill-none")}
      />
    </button>
  )
);

WishlistButton.displayName = "WishlistButton";
