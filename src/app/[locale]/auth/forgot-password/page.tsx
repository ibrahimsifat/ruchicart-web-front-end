import { ForgotPasswordSkeleton } from "@/components/skeleton/forgot-password-skeleton";
import ForgotPasswordForm from "@/features/auth/forgot-password";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
