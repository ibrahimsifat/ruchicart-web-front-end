import { clsx, type ClassValue } from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS classes safely
 * @param inputs - Array of class values to be combined
 * @returns Merged and de-duplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

type DiscountType = "percent" | "fixed";

interface DiscountParams {
  price: number;
  discount: number;
  discount_type: DiscountType | string;
}

/**
 * Calculates the discounted price based on the original price and discount
 * @param params - Object containing price, discount, and discount type
 * @returns Calculated discounted price (never negative)
 */
export function getDiscountedPrice({
  price,
  discount = 0,
  discount_type,
}: DiscountParams): number {
  // Ensure inputs are valid numbers
  const validPrice = Math.max(0, Number(price) || 0);
  const validDiscount = Math.max(0, Number(discount) || 0);

  // Calculate discount based on type
  let discountedPrice = validPrice;
  if (discount_type === "percent") {
    // Ensure percentage is between 0 and 100
    const validPercentage = Math.min(100, validDiscount);
    discountedPrice = validPrice - (validPrice * validPercentage) / 100;
  } else if (discount_type === "fixed") {
    // Ensure fixed discount doesn't exceed price
    discountedPrice = validPrice - Math.min(validPrice, validDiscount);
  }

  // Round to 2 decimal places and ensure non-negative
  return Math.max(0, Math.round(discountedPrice * 100) / 100);
}

/**
 * Formats a number as a price string with 2 decimal places
 * @param price - Number to format as price
 * @returns Formatted price string
 */
export function formatPrice(price: number | string | undefined): string {
  const numPrice = Number(price) || 0;
  return numPrice.toFixed(2);
}

/**
 * Validates if a string is a valid discount type
 * @param type - String to validate
 * @returns Boolean indicating if type is valid
 */
export function isValidDiscountType(type: string): type is DiscountType {
  return ["percent", "fixed"].includes(type);
}
// Function to clean the HTML content
export const cleanContent = (content: string) => {
  // Remove editor-specific divs and attributes
  let cleaned = content.replace(/<div class="ql-[^>]*>/g, "");
  cleaned = cleaned.replace(/<div class="ql-[^>]*>.*?<\/div>/g, "");
  cleaned = cleaned.replace(
    /<grammarly-extension[^>]*>.*?<\/grammarly-extension>/g,
    ""
  );

  // Sanitize the HTML to prevent XSS
  const sanitized = DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS: ["p", "strong", "em", "br", "div"],
    ALLOWED_ATTR: ["class"],
  });

  return sanitized;
};
