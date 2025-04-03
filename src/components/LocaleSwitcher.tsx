"use client";

import { CONSTANT } from "@/config/constants";
import { usePathname, useRouter } from "@/i18n/routing";
import { useBanners } from "@/lib/hooks/queries/banner/useBanners";
import { useCategories } from "@/lib/hooks/queries/category/useCategories";
import {
  useLatestProducts,
  usePopularProducts,
} from "@/lib/hooks/queries/product/useProducts";
import { revalidateTags } from "@/lib/utils/revalidate";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const bgFlag = CONSTANT.images.bdFlag;
  const enFlag = CONSTANT.images.usFlag;
  const { refetch: refetchPopular } = usePopularProducts();
  const { refetch: refetchLatest } = useLatestProducts();
  const { refetch: refetchBranch } = useBanners();
  const { refetch: refetchCategories } = useCategories();

  const toggleLanguage = async () => {
    const nextLocale = locale === "en" ? "bn" : "en";

    // Call the server action to revalidate tags
    try {
      const result = await revalidateTags();
      console.log("Tags revalidated:", result);
    } catch (error) {
      console.error("Failed to revalidate tags:", error);
    }

    startTransition(() => {
      router.replace({ pathname, params }, { locale: nextLocale });
      // Refetch queries after locale change
      refetchPopular();
      refetchLatest();
      refetchBranch();
      refetchCategories();
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="px-4 py-2 rounded-md hover:bg-primary/20 text-gray-800 transition-colors font-bold border border-primary-text/30"
    >
      <div className="flex items-center gap-2">
        <Image
          src={`${locale === "en" ? bgFlag : enFlag}`}
          alt={locale}
          width={20}
          height={20}
        />
        <span>{locale === "en" ? "বাংলা" : "English"}</span>
      </div>
    </button>
  );
}
