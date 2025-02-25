import { LoadingSpinner } from "@/components/LoadingSpinner";
import Providers from "@/lib/provider/providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode, Suspense } from "react";

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
    // </Suspense>
  );
}

export default function BaseLayout({ children, locale }: LayoutProps) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <Suspense fallback={<LoadingSpinner />}>
          {/* <ErrorBoundary> */}
          <LocalizedContent locale={locale}>{children}</LocalizedContent>
          {/* </ErrorBoundary> */}
        </Suspense>
      </body>
    </html>
  );
}
