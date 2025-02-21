import { NewsletterSubscription } from "@/features/static-page/newsletter-subscription";
import type React from "react";
import PageLayout from "./pageLayout";

interface StaticPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function StaticPageLayout({ children, title }: StaticPageLayoutProps) {
  return (
    <PageLayout>
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary-text">{title}</h1>
        <div className="prose max-w-none">{children}</div>
        <div className="mt-12">
          <NewsletterSubscription />
        </div>
      </main>
    </PageLayout>
  );
}
