"use Client";
import { ComingSoon } from "@/components/ui/coming-soon";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();

  return (
    <ComingSoon
      title="Wallets Coming Soon!"
      description="Get ready for an exciting wallets program where you can earn points on every order and redeem them for delicious treats!"
      illustration="/rewards-coming-soon.svg"
      onBackClick={() => router.back()}
    />
  );
}
