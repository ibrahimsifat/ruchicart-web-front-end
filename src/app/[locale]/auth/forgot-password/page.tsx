import ForgotPasswordForm from "@/features/auth/forgot-password";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
