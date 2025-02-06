import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface MapStatusProps {
  type: "loading" | "error";
  message?: string;
  onRetry?: () => void;
}

export function MapStatus({ type, message, onRetry }: MapStatusProps) {
  if (type === "loading") {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Loading Google Maps...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Google Maps</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">
            {message ||
              "Please check your API key configuration and try again."}
          </p>
          <div className="space-y-2 text-sm">
            <p>To fix this error:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Go to the Google Cloud Console</li>
              <li>Enable the Maps JavaScript API</li>
              <li>Create credentials (API key)</li>
              <li>Add your domain to the key's restrictions</li>
              <li>Set the API key in your environment variables</li>
            </ol>
          </div>
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
