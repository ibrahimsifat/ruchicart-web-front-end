import { NotFoundPage } from "@/components/ui/not-found";
import { routing } from "@/i18n/routing";
import BaseLayout from "@/layouts/baseLayout";
export default function NotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <NotFoundPage />
    </BaseLayout>
  );
}
