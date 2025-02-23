import Link from "next/link";
import { memo } from "react";

interface ProductTitleProps {
  id: number;
  name: string;
}

export const ProductTitle = memo(({ id, name }: ProductTitleProps) => (
  <Link href={`/products/${id}`}>
    <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
      {name}
    </h3>
  </Link>
));

ProductTitle.displayName = "ProductTitle";
