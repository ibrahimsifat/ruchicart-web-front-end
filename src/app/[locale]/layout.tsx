import { routing } from "@/i18n/routing";
import "@/styles/globals.css";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import BaseLayout from "../../layouts/baseLayout";
const inter = Inter({ subsets: ["latin"] });
type SupportedLocale = (typeof routing.locales)[number];
type Props = {
  children: ReactNode;
  params: { locale: string };
};
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"), // Localized title
    description: t("description"), // Localized description
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/default-og-image.jpg", // Fallback OpenGraph image
          width: 800,
          height: 600,
          alt: t("title"),
        },
      ],
      url: "https://ruchicart.com", // Fallback URL
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/default-twitter-image.jpg"], // Fallback Twitter image
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
function isValidLocale(locale: string): locale is SupportedLocale {
  return routing.locales.includes(locale as SupportedLocale);
}
