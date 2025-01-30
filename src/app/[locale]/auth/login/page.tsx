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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function LoginPage() {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const router = useRouter();
  const { login, loginWithOtp, error, isLoading, clearError } = useAuthStore();

  const emailLoginSchema = z.object({
    email: z.string().email(t("errors.invalidEmail")),
    password: z.string().min(6, t("errors.invalidPassword")),
  });

  const phoneLoginSchema = z.object({
    phone: z
      .string()
      .regex(/^(\+8801|8801|01)[3-9]{1}[0-9]{8}$/, t("errors.invalidPhone")),
  });

  const emailForm = useForm<z.infer<typeof emailLoginSchema>>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneLoginSchema>>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: "" },
  });

  const onEmailSubmit = async (values: z.infer<typeof emailLoginSchema>) => {
    try {
      await login(values.email, values.password);
      router.push("/");
    } catch (error) {
      // Error is handled by the store
    }
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneLoginSchema>) => {
    try {
      await loginWithOtp(values.phone);
      router.push(`/auth/verify-otp?phone=${values.phone}&mode=login`);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/placeholder.svg"
              alt="Logo"
              width={120}
              height={40}
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.loginTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.loginDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "email" | "phone");
              clearError();
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email">{t("common.email")}</TabsTrigger>
              <TabsTrigger value="phone">{t("common.phone")}</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.email")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("common.email")}
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.password")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={t("common.password")}
                              {...field}
                              className="bg-background pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("common.loading") : t("common.login")}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="phone">
              <Form {...phoneForm}>
                <form
                  onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.phone")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Image
                                src="/bd-flag.png"
                                alt="Bangladesh"
                                width={20}
                                height={15}
                                className="rounded-sm"
                              />
                            </div>
                            <Input
                              placeholder="01XXXXXXXXX"
                              {...field}
                              className="bg-background pl-12"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("common.sending") : t("common.sendOtp")}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("common.or")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" className="w-full">
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="mr-2"
              />
              Facebook
            </Button>
          </div>
          <div className="text-center text-sm">
            {t("common.dontHaveAccount")}{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-primary hover:underline"
            >
              {t("common.signup")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
