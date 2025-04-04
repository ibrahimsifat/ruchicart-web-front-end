import { StaticPageLayout } from "@/layouts/staticPageLayout";
import { getPages } from "@/lib/api/pages";
import { cleanContent } from "@/lib/utils/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://ruchicart.com"
  ),
  title: "Return Policy | RuchiCart",
  description: "Learn about our return policy for food orders and deliveries.",
};

export default async function ReturnPolicyPage() {
  const { return_page } = await getPages();

  return (
    <StaticPageLayout title="Return Policy">
      <div
        dangerouslySetInnerHTML={{
          __html:
            cleanContent(return_page?.content) ||
            "Return policy not available.",
        }}
      />
    </StaticPageLayout>
  );
}
