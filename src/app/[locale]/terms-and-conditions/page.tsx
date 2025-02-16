import { getPages } from "@/lib/api/pages";
import { cleanContent } from "@/lib/utils/utils";
import type { Metadata } from "next";
import { StaticPageLayout } from "../layouts/staticPageLayout";

export const metadata: Metadata = {
  title: "Terms and Conditions | Stack Food",
  description: "Read our terms and conditions for using Stack Food services.",
};

export default async function TermsAndConditionsPage() {
  const { terms_and_conditions } = await getPages();

  return (
    <StaticPageLayout title="Terms and Conditions">
      <div
        dangerouslySetInnerHTML={{
          __html:
            cleanContent(terms_and_conditions) ||
            "Terms and conditions not available.",
        }}
      />
    </StaticPageLayout>
  );
}
