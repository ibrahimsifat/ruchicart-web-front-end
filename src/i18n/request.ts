import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
// Define a type for supported locales
type SupportedLocale = (typeof routing.locales)[number];

// Type guard function to validate locales
function isValidLocale(
  locale: string | null | undefined
): locale is SupportedLocale {
  return (
    typeof locale === "string" &&
    routing.locales.includes(locale as SupportedLocale)
  );
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!isValidLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("../messages/en.json")
        : import(`../messages/${locale}.json`))
    ).default,
  };
});
