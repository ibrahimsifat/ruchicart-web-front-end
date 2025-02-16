import { getPages } from "@/lib/api/pages";
import { cleanContent } from "@/lib/utils/utils";
import type { Metadata } from "next";
import { StaticPageLayout } from "../layouts/staticPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Stack Food",
  description:
    "Learn about how we protect your privacy and handle your data at Stack Food.",
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
