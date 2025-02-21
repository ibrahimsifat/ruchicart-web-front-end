import { getPages } from "@/lib/api/pages";
import { cleanContent } from "@/lib/utils/utils";
import type { Metadata } from "next";
import { StaticPageLayout } from "../../../layouts/staticPageLayout";

export const metadata: Metadata = {
  title: "About Us | RuchiCart",
  description:
    "Learn more about RuchiCart and our mission to deliver delicious meals to your doorstep.",
};

export default async function AboutUsPage() {
  const data = await getPages();
  const about_us = data.about_us;

  return (
    <StaticPageLayout title="About Us">
      <div dangerouslySetInnerHTML={{ __html: cleanContent(about_us) }} />
    </StaticPageLayout>
  );
}
