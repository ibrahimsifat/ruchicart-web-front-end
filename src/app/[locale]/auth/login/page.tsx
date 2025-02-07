import { LoginSkeleton } from "@/components/skeleton/login-skeleton";
import LoginForm from "@/features/auth/login";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
