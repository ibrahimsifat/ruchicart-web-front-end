"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useBranchStore } from "@/store/branchStore";
import { useConfigStore } from "@/store/configStore";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConfig } from "../hooks/queries/config/useConfig";

function BranchCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentBranch } = useBranchStore();
  const { config, setConfig } = useConfigStore();
  const { data: configData, isLoading, error } = useConfig();

  useEffect(() => {
    if (configData && !config) {
      setConfig(configData);
    }
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [configData, config, setConfig, isLoading]);

  useEffect(() => {
    if (isInitialized && config && !currentBranch) {
      const selectBranchPath = `/${locale}/select-branch`;
      if (pathname !== selectBranchPath) {
        router.push(selectBranchPath);
      }
    }
  }, [isInitialized, config, currentBranch, router, pathname, locale]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading configuration
      </div>
    );
  }

  return <>{children}</>;
}

export default BranchCheck;
