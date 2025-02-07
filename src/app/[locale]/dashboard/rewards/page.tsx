"use client";
import { ComingSoon } from "@/components/ui/coming-soon";
import { useRouter } from "next/navigation";

export default function RewardsPage() {
  const router = useRouter();

  return (
    <ComingSoon
      title="Rewards Program Coming Soon!"
      description="Get ready for an exciting rewards program where you can earn points on every order and redeem them for delicious treats!"
      illustration="/rewards-coming-soon.svg"
      onBackClick={() => router.back()}
    />
  );
}
