import { RegistrationSkeleton } from "@/components/skeleton/registration-skeleton";
import ResetPasswordForm from "@/features/auth/reset-password";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<RegistrationSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
