"use client";
import { ComingSoon } from "@/components/ui/coming-soon";
import { useRouter } from "next/navigation";

export default function LoyaltyPointsPage() {
  const router = useRouter();

  return (
    <ComingSoon
      title="Loyalty Points Coming Soon!"
      description="Get ready for an exciting loyalty points program where you can earn points on every order and redeem them for delicious treats!"
      illustration="/rewards-coming-soon.svg"
      onBackClick={() => router.back()}
    />
  );
}
