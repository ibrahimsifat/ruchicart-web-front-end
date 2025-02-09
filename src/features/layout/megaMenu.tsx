import { cn } from "@/lib/utils/utils";
import { Category } from "@/types";
import { ImageType } from "@/types/image";
import Link from "next/link";
import { Card } from "../../components/ui/card";
import CustomImage from "../../components/ui/customImage";
import { getCategoryBGGradient } from "../../components/utils/getCategoryBGGradient";

const MegaMenu = ({ categories }: { categories: Category[] }) => {
  return (
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
                  "rounded-lg"
                )}
              >
                <div
                  className={cn(
                    "p-4 flex flex-col items-center justify-center aspect-square transition-all duration-500"
                  )}
                >
                  <CustomImage
                    src={category.image}
                    type={ImageType.CATEGORY}
                    width={200}
                    height={200}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-300"
                    )}
                    alt={`${category.name} category`}
                  />

                  <span
                    className={cn(
                      "font-medium md:text-md text-sm text-center group-hover:font-bold transition-all duration-300 h-9"
                    )}
                  >
                    {category.name}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
