import { StaticPageLayout } from "@/layouts/staticPageLayout";
import { getPages } from "@/lib/api/pages";
import { cleanContent } from "@/lib/utils/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://ruchicart.com"
  ),
  title: "Privacy Policy | RuchiCart",
  description:
    "Learn about how we protect your privacy and handle your data at RuchiCart.",
};

export default async function PrivacyPolicyPage() {
  const { privacy_policy } = await getPages();

  return (
    <StaticPageLayout title="Privacy Policy">
      <div
        dangerouslySetInnerHTML={{
          __html:
            cleanContent(privacy_policy) || "Privacy policy not available.",
        }}
      />
    </StaticPageLayout>
  );
}
