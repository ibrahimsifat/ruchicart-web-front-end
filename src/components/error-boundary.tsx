"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import React, { type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-2xl font-bold">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                We're sorry, but it seems like there was an error. Our team has
                been notified and is working on fixing the issue.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Refresh Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
