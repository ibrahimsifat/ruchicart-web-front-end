import { AppDownload } from "@/features/home/appDownload";
import { Footer } from "@/features/layout/footer";
import { Navbar } from "@/features/layout/navbar";
import TopBar from "@/features/layout/topBar";
import { memo, ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(Footer);
const MemoizedTopBar = memo(TopBar);
export default function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MemoizedTopBar />
      <MemoizedNavbar />
      <main>
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <div className="container mx-auto px-4">
        <AppDownload />
      </div>
      <MemoizedFooter />
    </div>
  );
}
