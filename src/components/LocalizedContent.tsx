import { ReactNode, Suspense } from "react";

// components/LocalizedContent.tsx
export default function LocalizedContent({
  children,
}: {
  children: ReactNode;
  locale: string;
}) {
  return (
    <div className="flex flex-col flex-grow">
      <Suspense fallback={<div>Loading navigation...</div>}>
        <p>Navigation</p>
      </Suspense>
      <Suspense fallback={<div>Loading content...</div>}>{children}</Suspense>
    </div>
  );
}
