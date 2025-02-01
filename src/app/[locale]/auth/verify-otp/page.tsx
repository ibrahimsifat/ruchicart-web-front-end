import VerifyOtpForm from "@/features/auth/otpVerify";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
