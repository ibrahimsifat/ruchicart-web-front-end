export const config = {
  port: process.env.PORT || 3000,
  host: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:${process.env.PORT}`,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    defaultCenter: { lat: 23.8103, lng: 90.4125 }, // Default to Dhaka, Bangladesh
    defaultZoom: 11,
  },
} as const;

// Validate environment variables
if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  console.error(
    "Please define the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable inside .env.local"
  );
}
