import { Link } from "@/i18n/routing";
import { UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./button";

export const NotFoundPage = () => {
  const t = useTranslations("notFound");
  return (
    <div className="max-w-md w-full space-y-8 text-center">
      <UtensilsCrossed className="mx-auto h-24 w-24 text-primary" />
      <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
        Oops! Page not found
        {t("title")}
      </h1>
      <p className="mt-2 text-lg text-gray-600">{t("description")}</p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">{t("goBackHome")}</Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/categories">{t("browseCategory")}</Link>
        </Button>
      </div>
      <p className="mt-6 text-base text-gray-500">{t("needHelp")}</p>
    </div>
  );
};
