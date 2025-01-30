import CustomImage from "@/components/ui/customImage";
import { Category } from "@/types";
import { ImageType } from "@/types/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>

      <CustomImage
        src={category.image}
        type={ImageType.CATEGORY}
        width={200}
        height={200}
        className="rounded-lg"
        alt="Category Image"
      />
      <div className="flex items-center justify-between">
        {/* <span
          className={`px-3 py-1 rounded-full text-sm ${
            category.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {category.status}
        </span> */}
        <Link
          href={`/categories/${category.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
