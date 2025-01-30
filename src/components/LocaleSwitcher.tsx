"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    startTransition(() => {
      router.replace({ pathname, params }, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
    >
      {locale === "en" ? "বাংলা" : "English"}
    </button>
  );
}
