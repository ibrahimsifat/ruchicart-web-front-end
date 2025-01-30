import { routing } from "@/i18n/routing";
import "@/styles/globals.css";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import Providers from "./query-provider";

const inter = Inter({ subsets: ["latin"] });
type SupportedLocale = (typeof routing.locales)[number];
type Props = {
  children: ReactNode;
  params: { locale: string };
};
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
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
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
function isValidLocale(locale: string): locale is SupportedLocale {
  return routing.locales.includes(locale as SupportedLocale);
}
