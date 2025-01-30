import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TopBar } from "@/components/layout/top-bar";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main>
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
