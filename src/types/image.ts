export enum ImageType {
  CATEGORY = "category",
  PRODUCT = "product",
  BANNER = "banner",
  PROFILE = "profile",
  REVIEW = "review",
  NOTIFICATION = "notification",
  RESTAURANT = "restaurant",
  DELIVERY = "delivery-man",
  CHAT = "chat",
  BRANCH = "branch",
  GATEWAY = "gateway",
}
export interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  type?: ImageType;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  priority?: boolean;
  fill?: boolean;
}
