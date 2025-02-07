"use client";
import { DashboardSidebar } from "@/features/dashboard/dashboardSidebar";
import { useRouter } from "@/i18n/routing";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import PageLayout from "../layouts/PageLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push(`/auth/login`);
    }
  }, [token, router]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <DashboardSidebar />
          {/* Main Content */}
          <div className="flex-1 space-y-8">{children}</div>
        </div>
      </div>
    </PageLayout>
  );
}
