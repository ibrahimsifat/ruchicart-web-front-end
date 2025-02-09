import { LoginSkeleton } from "@/components/skeleton/login-skeleton";
import VerifyOtpForm from "@/features/auth/otpVerify";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
