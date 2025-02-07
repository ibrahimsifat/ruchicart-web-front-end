"use client";
import { ComingSoon } from "@/components/ui/coming-soon";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <ComingSoon
      title="Settings Coming Soon!"
      description="Get ready for an exciting settings program where you can earn points on every order and redeem them for delicious treats!"
      illustration="/rewards-coming-soon.svg"
      onBackClick={() => router.back()}
    />
  );
}
