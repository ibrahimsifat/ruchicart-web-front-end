"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CONSTANT } from "@/config/constants";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const {
    verifyOtp,
    sendOTP,
    initializeRecaptcha,
    error,
    isLoading,
    getProfileInfo,
  } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"registration" | "login">("registration");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    const modeParam = searchParams.get("mode") as "registration" | "login";
    if (phoneParam) {
      setPhone(phoneParam);
      handleSendOTP(phoneParam);
    }
    if (modeParam) setMode(modeParam);
  }, [searchParams]);

  useEffect(() => {
    // Initialize reCAPTCHA when the component mounts
    initializeRecaptcha("recaptcha-container").catch((error) => {
      console.error("Failed to initialize reCAPTCHA:", error);
    });
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (phoneNumber: string) => {
    try {
      await sendOTP(phoneNumber);
      setCountdown(60);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      await verifyOtp(phone, values.otp);
      await getProfileInfo();
      //TODO: Redirect to previous url
      router.push("/");
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src={CONSTANT.images.logo}
              alt="Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("verifyOtp")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("enter6DigitCodeSentTo", { phone })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enter6DigitCode")}
                        {...field}
                        maxLength={6}
                        className="text-center text-2xl tracking-[1em] font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("verifying") : t("verifyOtp")}
              </Button>

              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => phone && handleSendOTP(phone)}
                  disabled={countdown > 0 || isLoading}
                  className="text-sm text-primary-text hover:text-primary-text/80"
                >
                  {countdown > 0
                    ? `${t("resendOtpIn", { countdown })}`
                    : t("resendOtp")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/auth/login")}>
            {t("backToLogin")}
          </Button>
        </CardFooter>
      </Card>

      {/* Add a hidden container for reCAPTCHA */}
      <div id="recaptcha-container" style={{ display: "none" }}></div>
    </div>
  );
}
