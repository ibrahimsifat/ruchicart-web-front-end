import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface MapStatusProps {
  type: "loading" | "error";
  message?: string;
  onRetry?: () => void;
}

export function MapStatus({ type, message, onRetry }: MapStatusProps) {
  const t = useTranslations("location");
  if (type === "loading") {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {t("loadingGoogleMaps")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("errorLoadingGoogleMaps")}</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">
            {message ||
              "Please check your API key configuration and try again."}
          </p>
          {onRetry && (
            <Button variant="destructive" className="mt-4" onClick={onRetry}>
              Retry Loading Maps
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
