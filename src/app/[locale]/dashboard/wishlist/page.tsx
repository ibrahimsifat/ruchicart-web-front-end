"use client";
import { ComingSoon } from "@/components/ui/coming-soon";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();

  return (
    <ComingSoon
      title="Wishlist Coming Soon!"
      description="We're working on bringing you a personalized wishlist feature where you can save all your favorite dishes for later. Stay tuned for updates!"
      illustration="/wishlist-coming-soon.svg"
      onBackClick={() => router.back()}
    />
  );
}
