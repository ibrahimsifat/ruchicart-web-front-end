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
import { GooglePhoneVerification } from "@/features/auth/google-phone-verification";
import { registrationSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showGooglePhoneVerification, setShowGooglePhoneVerification] =
    useState(false);
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const router = useRouter();
  const t = useTranslations("auth");
  const {
    registration,
    error,
    isLoading,
    clearError,
    googleLogin,
    getProfileInfo,
    existingAccountCheck,
  } = useAuthStore();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      f_name: "",
      l_name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    clearError();
  }, []);

  const onSubmit = async (values: z.infer<typeof registrationSchema>) => {
    try {
      await registration(values);
      router.push(`/auth/verify-otp?phone=${values.phone}&mode=registration`);
    } catch (error) {
      // Error is handled by the store
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      if (result.status) {
        // User successfully logged in
        // get the profile data
        getProfileInfo();
        router.push("/");
      } else if (result.tempToken && result?.userData?.email) {
        // Need to verify if user wants to use existing account or create new one
        const emailExistsResponse = await existingAccountCheck({
          email: result?.userData.email,
          // sending user_response Because this is new user
          user_response: 1,
          medium: "google",
        });

        if (emailExistsResponse.status) {
          // User chose to use existing account
          router.push("/");
        } else {
          // User chose to create new account
          // Only now show phone verification if needed
          setGoogleUserData(result.userData);
          setShowGooglePhoneVerification(true);
        }
      } else {
        console.error("Unexpected response from Google login");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
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
            {t("registrationTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("registrationDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="f_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="l_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@example.com"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Image
                            src={CONSTANT.images.bdFlag}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("passwordPlaceholder")}
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

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("signingUp") : t("signUp")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>
          <div className=" w-80">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Image
                src={CONSTANT.images.googleSignin}
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </Button>
          </div>
          <div className="text-center text-sm">
            {t("alreadyHaveAccount")}
            <Link
              href="/auth/login"
              className="font-semibold text-primary-text hover:underline"
            >
              {t("login")}
            </Link>
          </div>
        </CardFooter>
      </Card>
      {showGooglePhoneVerification && (
        <GooglePhoneVerification
          isOpen={showGooglePhoneVerification}
          onClose={() => setShowGooglePhoneVerification(false)}
          googleUserData={googleUserData}
        />
      )}
    </div>
  );
}
