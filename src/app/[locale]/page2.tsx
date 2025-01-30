import PageLayout from "@/app/[locale]/layouts/PageLayout";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  params: { locale: string };
};

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  // Get translations on the server side
  const t = await getTranslations("PathnamesPage");

  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <PageLayout title={t("title")}>
        <LocaleSwitcher />
        <Suspense fallback={<div>Loading content...</div>}>
          {t.rich("description", {
            p: (chunks) => <p className="mt-4">{chunks}</p>,
            code: (chunks) => (
              <code className="font-mono text-white">{chunks}</code>
            ),
          })}
        </Suspense>
      </PageLayout>
    </Suspense>
  );
}
