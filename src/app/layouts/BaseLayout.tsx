import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
  locale: string;
};

async function LocalizedContent({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<div>Loading navigation...</div>}>
          <p>Navigation</p>
        </Suspense>
        <main className="flex-grow">
          <Suspense fallback={<div>Loading content...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </NextIntlClientProvider>
  );
}

export default function BaseLayout({ children, locale }: Props) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Suspense fallback={<div>Loading...</div>}>
          <LocalizedContent locale={locale}>{children}</LocalizedContent>
        </Suspense>
      </body>
    </html>
  );
}
