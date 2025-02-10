import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Heart } from "lucide-react";

const ProductCartWishlist = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline">
          <Heart className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Add to Wishlist</TooltipContent>
    </Tooltip>
  );
};

export default ProductCartWishlist;
