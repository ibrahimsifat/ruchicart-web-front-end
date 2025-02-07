import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import Providers from "../query-provider";

// Types
interface LayoutProps {
  children: ReactNode;
  locale: string;
}

// LocalizedContent as a Server Component
async function LocalizedContent({ children, locale }: LayoutProps) {
  const messages = await getMessages();

  return (
    <Providers>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </Providers>
  );
}

export default function BaseLayout({ children, locale }: LayoutProps) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <LocalizedContent locale={locale}>{children}</LocalizedContent>
      </body>
    </html>
  );
}
