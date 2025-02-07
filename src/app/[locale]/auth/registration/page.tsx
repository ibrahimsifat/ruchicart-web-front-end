import { RegistrationSkeleton } from "@/components/skeleton/registration-skeleton";
import RegistrationForm from "@/features/auth/registration";
import { Suspense } from "react";

export default function RegistrationPage() {
  return (
    <Suspense fallback={<RegistrationSkeleton />}>
      <RegistrationForm />
    </Suspense>
  );
}
