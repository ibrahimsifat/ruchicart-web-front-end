import { memo } from "react";

export const ProductDescription = memo(
  ({ description }: { description: string }) => (
    <p className="text-sm text-muted-foreground truncate">{description}</p>
  )
);

ProductDescription.displayName = "ProductDescription";
