"use client";
import { ToastProvider } from "@/components/ui/toast";
import { getQueryClient } from "@/lib/api/queries";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleMapsProvider } from "./google-maps-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleMapsProvider>
        <ToastProvider>
          {/* <BranchCheck> */}
          {children}
          {/* </BranchCheck> */}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ToastProvider>
      </GoogleMapsProvider>
    </QueryClientProvider>
  );
}
