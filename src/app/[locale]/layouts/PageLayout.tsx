import { Footer } from "@/features/layout/footer";
import { Navbar } from "@/features/layout/navbar";
import TopBar from "@/features/layout/topBar";
import { ReactNode, Suspense } from "react";

type Props = {
  children?: ReactNode;
};
function NavbarLoading() {
  return <div className="h-16 bg-gray-100 animate-pulse" />;
}

function TopBarLoading() {
  return <div className="h-8 bg-gray-100 animate-pulse" />;
}

function FooterLoading() {
  return <div className="h-40 bg-gray-100 animate-pulse" />;
}

function MainContentLoading() {
  return <div className="min-h-screen bg-gray-100 animate-pulse" />;
}

export default function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<TopBarLoading />}>
        <TopBar />
      </Suspense>

      <Suspense fallback={<NavbarLoading />}>
        <Navbar />
      </Suspense>

      <main>
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Suspense fallback={<FooterLoading />}>
        <Footer />
      </Suspense>
    </div>
  );
}
