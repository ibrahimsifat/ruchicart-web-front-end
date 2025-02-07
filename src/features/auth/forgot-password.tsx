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
import { ArrowLeft, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  phone: z
    .string()
    .regex(
      /^(\+8801|8801|01)[3-9]{1}[0-9]{8}$/,
      "Invalid Bangladeshi phone number"
    ),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword, error, isLoading, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const t = useTranslations("auth");
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await forgotPassword(values.phone);
      setSuccessMessage("A reset code has been sent to your phone number.");
      setTimeout(() => {
        router.push(`/auth/reset-password?phone=${values.phone}`);
      }, 3000);
    } catch (error) {
      console.error("Error sending reset code:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image
              src={CONSTANT.images.logo}
              alt="Logo"
              width={120}
              height={40}
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("forgotPasswordTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("forgotPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phoneNumber")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                          placeholder={t("phoneNumberPlaceholder")}
                          {...field}
                          className="pl-10"
                        />
                      </div>
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
              {successMessage && (
                <Alert>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("sending") : t("sendResetCode")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login">
            <Button variant="link" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("backToLogin")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
