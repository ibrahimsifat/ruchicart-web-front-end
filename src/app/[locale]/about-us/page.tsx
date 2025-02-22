import { LoadingSpinner } from "@/components/LoadingSpinner";
import { StaticPageLayout } from "@/layouts/staticPageLayout";
import { getPages } from "@/lib/api/pages";
import { cleanContent } from "@/lib/utils/utils";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://ruchicart.com"
  ),
  title: "About Us | RuchiCart",
  description:
    "Learn more about RuchiCart and our mission to deliver delicious meals to your doorstep.",
};

export default async function AboutUsPage() {
  const data = await getPages();
  const about_us = data.about_us;

  return (
    <StaticPageLayout title="About Us">
      <Suspense fallback={<LoadingSpinner />}>
        <div dangerouslySetInnerHTML={{ __html: cleanContent(about_us) }} />
      </Suspense>
    </StaticPageLayout>
  );
}
