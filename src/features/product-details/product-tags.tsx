import { Badge } from "@/components/ui/badge";
import { Category } from "@/types";
import { CategoryId } from "@/types/product";

export function ProductTags({
  categoryIds,
  categories,
}: {
  categoryIds: CategoryId[];
  categories: Category[];
}) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categoryIds.map((category) => (
          <Badge key={category.id} variant="outline">
            {categories.find((c) => c.id === Number(category.id))?.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
