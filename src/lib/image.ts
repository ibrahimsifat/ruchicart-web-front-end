import { ImageType } from "@/types/image";

export const getImageUrl = (
  path?: string | null,
  type: ImageType = ImageType.CATEGORY
): string => {
  if (!path) return "/placeholder.svg";

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://ruchicart.com";
  const storageUrl = `${baseUrl}/storage/app/public/${type}`;

  // Handle absolute URLs
  // if (path.startsWith("http")) return path;
  // console.log(`${storageUrl}/${path}`);
  return `${storageUrl}/${path}`;
};
