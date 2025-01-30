"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONSTANT } from "@/lib/utils/constants";
import { loginFormSchema } from "@/lib/validations/auth";
import type { LoginFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OtpVerificationModal } from "./otp-verification-modal";
import { PhoneLoginModal } from "./phone-login-modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export function LoginModal({ isOpen, onClose, onOpenSignUp }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log(data);
      // Add your login logic here
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhoneLogin = () => {
    onClose();
    setShowPhoneLogin(true);
  };

  const handleOpenOtp = (phone: string) => {
    setPhoneNumber(phone);
    setShowPhoneLogin(false);
    setShowOtpVerification(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex items-center">
            <Image
              src={CONSTANT.images.logo}
              alt="Stack Food"
              width={200}
              height={60}
              className="mx-auto mb-6"
            />
            <DialogTitle className="text-2xl font-bold">Login</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="Email/Phone" {...field} />
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
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
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

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label className="text-sm">Remember me</Label>
                    </FormItem>
                  )}
                />
                <Button variant="link" className="px-0 text-primary">
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full bg-primary">
                Login
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or Login with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Add Google login logic
                }}
              >
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handlePhoneLogin}
              >
                <span className="mr-2">🔒</span>
                OTP Sign in
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                </span>
                <Button
                  variant="link"
                  className="px-0 text-primary"
                  onClick={() => {
                    onClose();
                    onOpenSignUp();
                  }}
                >
                  Sign Up
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By login I Agree with all the{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-primary"
                >
                  Terms & Conditions
                </Button>
              </p>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <PhoneLoginModal
        isOpen={showPhoneLogin}
        onClose={() => setShowPhoneLogin(false)}
        onOpenOTP={handleOpenOtp}
      />

      <OtpVerificationModal
        isOpen={showOtpVerification}
        onClose={() => setShowOtpVerification(false)}
        phoneNumber={phoneNumber}
      />
    </>
  );
}
