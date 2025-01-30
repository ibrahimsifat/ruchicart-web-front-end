import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
  locale: string;
};

// Create a separate component for the content that needs messages
async function LocalizedContent({
  children,
}: {
  children: ReactNode;
  locale: string;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Suspense fallback={<div>Loading navigation...</div>}>
        {/* <Navigation /> */}
        <p>Navigation</p>
      </Suspense>
      <Suspense fallback={<div>Loading content...</div>}>{children}</Suspense>
    </NextIntlClientProvider>
  );
}

export default function BaseLayout({ children, locale }: Props) {
  return (
    <html lang={locale}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <LocalizedContent locale={locale}>{children}</LocalizedContent>
        </Suspense>
      </body>
    </html>
  );
}
