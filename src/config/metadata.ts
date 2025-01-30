import { Metadata } from "next";

// Utility function to generate metadata
export const generateMetadata = (pageMetadata: {
  title: string;
  description: string;
  image?: string;
  url?: string;
}): Metadata => ({
  title: pageMetadata.title,
  description: pageMetadata.description,
  openGraph: {
    title: pageMetadata.title,
    description: pageMetadata.description,
    images: [
      {
        url: pageMetadata.image || "/default-og-image.jpg", // Fallback image
        width: 800,
        height: 600,
        alt: pageMetadata.title,
      },
    ],
    url: pageMetadata.url || "https://yourwebsite.com", // Fallback URL
  },
  twitter: {
    card: "summary_large_image",
    title: pageMetadata.title,
    description: pageMetadata.description,
    images: [pageMetadata.image || "/default-twitter-image.jpg"], // Fallback image
  },
});
