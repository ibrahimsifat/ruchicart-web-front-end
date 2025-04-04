import { StaticPageLayout } from "@/layouts/staticPageLayout";
import { getPages } from "@/lib/api/pages";
import { cleanContent } from "@/lib/utils/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://ruchicart.com"
  ),
  title: "Cancellation Policy | RuchiCart",
  description:
    "Learn about our cancellation policy for food orders and deliveries.",
};

export default async function CancellationPolicyPage() {
  const { cancellation_page } = await getPages();

  return (
    <StaticPageLayout title="Cancellation Policy">
      <div
        dangerouslySetInnerHTML={{
          __html:
            cleanContent(cancellation_page?.content) ||
            "Cancellation policy not available.",
        }}
      />
    </StaticPageLayout>
  );
}
